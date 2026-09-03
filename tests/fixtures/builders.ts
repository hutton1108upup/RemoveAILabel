import { strToU8, zlibSync } from "fflate";

const encoder = new TextEncoder();

export function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

export function ascii(value: string): Uint8Array {
  return encoder.encode(value);
}

function be16(value: number): Uint8Array {
  return Uint8Array.of((value >>> 8) & 0xff, value & 0xff);
}

function be32(value: number): Uint8Array {
  return Uint8Array.of(
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  );
}

function le32(value: number): Uint8Array {
  return Uint8Array.of(
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  );
}

function jpegSegment(marker: number, data: Uint8Array): Uint8Array {
  return concatBytes(Uint8Array.of(0xff, marker), be16(data.length + 2), data);
}

export const C2PA_UUID = Uint8Array.of(
  0x63, 0x32, 0x70, 0x61, 0x00, 0x11, 0x00, 0x10,
  0x80, 0x00, 0x00, 0xaa, 0x00, 0x38, 0x9b, 0x71,
);

function isoBox(type: string, data: Uint8Array): Uint8Array {
  return concatBytes(be32(data.length + 8), ascii(type), data);
}

export function jpegC2paApp11Segments(splitAt?: number): Uint8Array[] {
  const description = isoBox("jumd", concatBytes(C2PA_UUID, ascii("c2pa\0")));
  const manifest = isoBox("jumb", concatBytes(description, isoBox("json", ascii("{}"))));
  const cut = splitAt ?? manifest.length;
  const fragments = [manifest.subarray(0, cut), manifest.subarray(cut)].filter(
    (part) => part.length > 0,
  );
  return fragments.map((fragment, index) =>
    jpegSegment(
      0xeb,
      concatBytes(
        ascii("JP"),
        be16(7),
        be32(index + 1),
        index === 0 ? new Uint8Array() : manifest.subarray(0, 8),
        fragment,
      ),
    ),
  );
}

export function jpegNonC2paApp11(data = "vendor-private"): Uint8Array {
  return jpegSegment(0xeb, ascii(data));
}

export function jpegExif(orientation: number = 1): Uint8Array {
  const tiff = Uint8Array.of(
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08,
    0x00, 0x01,
    0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01,
    0x00, orientation & 0xff, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  );
  return jpegSegment(0xe1, concatBytes(ascii("Exif\0\0"), tiff));
}

export function jpegMalformedExif(): Uint8Array {
  return jpegSegment(0xe1, concatBytes(ascii("Exif\0\0"), ascii("bad-tiff")));
}

export function jpegXmp(xml: string): Uint8Array {
  return jpegSegment(
    0xe1,
    concatBytes(ascii("http://ns.adobe.com/xap/1.0/\0"), ascii(xml)),
  );
}

export function jpegExtendedXmp(
  guid: string,
  offset: number,
  data: string,
  totalLength: number = offset + data.length,
): Uint8Array {
  const normalizedGuid = guid.padEnd(32, "0").slice(0, 32);
  return jpegSegment(
    0xe1,
    concatBytes(
      ascii("http://ns.adobe.com/xmp/extension/\0"),
      ascii(normalizedGuid),
      be32(totalLength),
      be32(offset),
      ascii(data),
    ),
  );
}

export function jpegIcc(sequence: number, total: number, data: string): Uint8Array {
  return jpegSegment(
    0xe2,
    concatBytes(ascii("ICC_PROFILE\0"), Uint8Array.of(sequence, total), ascii(data)),
  );
}

export function jpegApp13(data = "Photoshop-IPTC"): Uint8Array {
  return jpegSegment(0xed, ascii(data));
}

export interface JpegFixtureOptions {
  segments?: Uint8Array[];
  progressive?: boolean;
  scanData?: Uint8Array;
  truncated?: boolean;
}

export function buildJpeg(options: JpegFixtureOptions = {}): Uint8Array {
  const sofPayload = Uint8Array.of(
    8, 0, 1, 0, 1, 1, 1, 0x11, 0,
  );
  const sosPayload = Uint8Array.of(1, 1, 0, 0, 63, 0);
  const bytes = concatBytes(
    Uint8Array.of(0xff, 0xd8),
    ...(options.segments ?? []),
    jpegSegment(options.progressive ? 0xc2 : 0xc0, sofPayload),
    jpegSegment(0xda, sosPayload),
    options.scanData ?? Uint8Array.of(0x12, 0x34, 0xff, 0x00, 0x56),
    Uint8Array.of(0xff, 0xd9),
  );
  return options.truncated ? bytes.subarray(0, bytes.length - 1) : bytes;
}

let crcTable: Uint32Array | undefined;
function getCrcTable(): Uint32Array {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c >>> 0;
  }
  return crcTable;
}

export function pngCrc(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  const table = getCrcTable();
  for (const byte of bytes) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export function pngChunk(type: string, data: Uint8Array, corruptCrc = false): Uint8Array {
  const body = concatBytes(ascii(type), data);
  const crc = pngCrc(body) ^ (corruptCrc ? 1 : 0);
  return concatBytes(be32(data.length), body, be32(crc >>> 0));
}

export function pngText(key: string, value: string): Uint8Array {
  return pngChunk("tEXt", concatBytes(ascii(key), Uint8Array.of(0), ascii(value)));
}

export function pngZtxt(key: string, value: string): Uint8Array {
  return pngChunk(
    "zTXt",
    concatBytes(ascii(key), Uint8Array.of(0, 0), zlibSync(strToU8(value))),
  );
}

export function pngItxt(key: string, value: string, compressed = false): Uint8Array {
  const text = compressed ? zlibSync(strToU8(value)) : ascii(value);
  return pngChunk(
    "iTXt",
    concatBytes(
      ascii(key),
      Uint8Array.of(0, compressed ? 1 : 0, 0, 0, 0),
      text,
    ),
  );
}

export function pngExif(orientation: number = 1): Uint8Array {
  return pngChunk(
    "eXIf",
    Uint8Array.of(
      0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08,
      0x00, 0x01,
      0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01,
      0x00, orientation & 0xff, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
    ),
  );
}

export function pngMalformedExif(): Uint8Array {
  return pngChunk("eXIf", ascii("bad-tiff"));
}

export interface PngFixtureOptions {
  chunks?: Uint8Array[];
  colorType?: number;
  corruptIdatCrc?: boolean;
  apng?: boolean;
  idat?: Uint8Array;
}

export function buildPng(options: PngFixtureOptions = {}): Uint8Array {
  const ihdr = concatBytes(
    be32(1),
    be32(1),
    Uint8Array.of(8, options.colorType ?? 2, 0, 0, 0),
  );
  const apngChunks = options.apng
    ? [
        pngChunk("acTL", concatBytes(be32(1), be32(0))),
        pngChunk("fcTL", new Uint8Array(26)),
      ]
    : [];
  return concatBytes(
    Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a),
    pngChunk("IHDR", ihdr),
    ...(options.chunks ?? []),
    ...apngChunks,
    pngChunk("IDAT", options.idat ?? Uint8Array.of(0x78, 0x01, 0x00), options.corruptIdatCrc),
    ...(options.apng ? [pngChunk("fdAT", concatBytes(be32(0), Uint8Array.of(1, 2, 3)))] : []),
    pngChunk("IEND", new Uint8Array()),
  );
}

export function webpChunk(type: string, data: Uint8Array): Uint8Array {
  return concatBytes(
    ascii(type),
    le32(data.length),
    data,
    data.length % 2 === 1 ? Uint8Array.of(0) : new Uint8Array(),
  );
}

export interface WebpFixtureOptions {
  chunks?: Uint8Array[];
  invalidRiffSize?: boolean;
}

export function buildWebp(options: WebpFixtureOptions = {}): Uint8Array {
  const chunks = options.chunks ?? [webpChunk("VP8 ", Uint8Array.of(1, 2, 3))];
  const body = concatBytes(ascii("WEBP"), ...chunks);
  const declaredSize = body.length + (options.invalidRiffSize ? 7 : 0);
  return concatBytes(ascii("RIFF"), le32(declaredSize), body);
}

export function vp8x(flags: number): Uint8Array {
  return webpChunk("VP8X", Uint8Array.of(flags, 0, 0, 0, 0, 0, 0, 0, 0, 0));
}
