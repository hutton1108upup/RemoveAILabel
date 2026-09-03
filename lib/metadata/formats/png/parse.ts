import { asciiAt, readAscii, readBe32 } from "../../bytes";
import { MetadataError } from "../../errors";
import { readTiffOrientation } from "../../exif";
import { parsePngText, type ParsedPngText } from "./text";

const PNG_SIGNATURE = Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
const MAX_CHUNKS = 100_000;
const MAX_TEXT_BYTES = 4 * 1024 * 1024;
const MAX_METADATA_BYTES = 16 * 1024 * 1024;

let crcTable: Uint32Array | undefined;
function getCrcTable(): Uint32Array {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let bit = 0; bit < 8; bit += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c >>> 0;
  }
  return crcTable;
}

export function pngCrc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  const table = getCrcTable();
  for (const byte of bytes) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export interface PngChunk {
  type: string;
  start: number;
  end: number;
  dataStart: number;
  dataEnd: number;
  data: Uint8Array;
  text?: ParsedPngText;
}

export interface ParsedPng {
  chunks: PngChunk[];
  textChunks: Array<PngChunk & { text: ParsedPngText }>;
  width: number;
  height: number;
  colorType: number;
  hasAlpha: boolean;
  animated: boolean;
  orientation: number | null | undefined;
  exifOrientationSafe: boolean;
}

function isMetadata(type: string): boolean {
  return ["caBX", "tEXt", "zTXt", "iTXt", "eXIf", "iCCP"].includes(type);
}

export function parsePng(bytes: Uint8Array): ParsedPng {
  if (
    bytes.length < PNG_SIGNATURE.length ||
    !PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)
  ) {
    throw new MetadataError("INVALID_MAGIC_BYTES", "PNG signature is missing.");
  }
  const chunks: PngChunk[] = [];
  let offset = 8;
  let metadataBytes = 0;
  let sawIend = false;
  for (let count = 0; count < MAX_CHUNKS && offset < bytes.length; count += 1) {
    if (offset + 12 > bytes.length) {
      throw new MetadataError("TRUNCATED_CONTAINER", "PNG chunk header is truncated.");
    }
    const length = readBe32(bytes, offset);
    const type = readAscii(bytes, offset + 4, 4);
    if (!/^[A-Za-z]{4}$/.test(type)) {
      throw new MetadataError("INVALID_SEGMENT_LENGTH", "PNG chunk type is invalid.");
    }
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const end = dataEnd + 4;
    if (!Number.isSafeInteger(end) || end > bytes.length) {
      throw new MetadataError("TRUNCATED_CONTAINER", `PNG ${type} chunk exceeds the file boundary.`);
    }
    const expectedCrc = readBe32(bytes, dataEnd);
    const actualCrc = pngCrc32(bytes.subarray(offset + 4, dataEnd));
    if (expectedCrc !== actualCrc) {
      throw new MetadataError("INVALID_SEGMENT_LENGTH", `PNG ${type} CRC check failed.`);
    }
    const data = bytes.subarray(dataStart, dataEnd);
    const chunk: PngChunk = { type, start: offset, end, dataStart, dataEnd, data };
    if (["tEXt", "zTXt", "iTXt"].includes(type)) {
      if (length > MAX_TEXT_BYTES) {
        throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG text chunk exceeds the safe limit.");
      }
      chunk.text = parsePngText(type, data);
    }
    if (isMetadata(type)) {
      metadataBytes += length;
      if (metadataBytes > MAX_METADATA_BYTES) {
        throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG metadata exceeds the safe processing limit.");
      }
    }
    chunks.push(chunk);
    offset = end;
    if (type === "IEND") {
      sawIend = true;
      break;
    }
  }
  if (!sawIend || offset !== bytes.length) {
    throw new MetadataError("TRUNCATED_CONTAINER", "PNG IEND is missing or trailing bytes are present.");
  }
  const ihdr = chunks[0];
  if (!ihdr || ihdr.type !== "IHDR" || ihdr.data.length !== 13 || !asciiAt(bytes, 12, "IHDR")) {
    throw new MetadataError("INVALID_SEGMENT_LENGTH", "PNG IHDR must be the first chunk.");
  }
  if (!chunks.some((chunk) => chunk.type === "IDAT")) {
    throw new MetadataError("TRUNCATED_CONTAINER", "PNG has no IDAT payload.");
  }
  const colorType = ihdr.data[9];
  const exifOrientations = chunks
    .filter((chunk) => chunk.type === "eXIf")
    .map((chunk) => readTiffOrientation(chunk.data));
  const validOrientations = exifOrientations.filter((value): value is number => value !== null);
  const exifOrientationSafe = exifOrientations.length === 0 ||
    (validOrientations.length === exifOrientations.length &&
      validOrientations.every((value) => value === validOrientations[0]));
  const orientation = exifOrientations.length === 0
    ? undefined
    : exifOrientationSafe
      ? validOrientations[0]
      : null;
  return {
    chunks,
    textChunks: chunks.filter((chunk): chunk is PngChunk & { text: ParsedPngText } => Boolean(chunk.text)),
    width: readBe32(ihdr.data, 0),
    height: readBe32(ihdr.data, 4),
    colorType,
    hasAlpha: colorType === 4 || colorType === 6 || chunks.some((chunk) => chunk.type === "tRNS"),
    animated: chunks.some((chunk) => chunk.type === "acTL"),
    orientation,
    exifOrientationSafe,
  };
}
