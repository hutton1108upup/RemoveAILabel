import { asciiAt, readAscii, readLe32 } from "../../bytes";
import { MetadataError } from "../../errors";
import { containsConfirmedAiXmp } from "../../xmp";

const MAX_CHUNKS = 100_000;
const MAX_METADATA_BYTES = 16 * 1024 * 1024;

export interface WebpChunk {
  type: string;
  start: number;
  end: number;
  dataStart: number;
  dataEnd: number;
  data: Uint8Array;
  aiXmp: boolean;
}

export interface ParsedWebp {
  chunks: WebpChunk[];
  declaredFileSize: number;
  width?: number;
  height?: number;
  animated: boolean;
  hasAlpha: boolean;
}

export function parseWebp(bytes: Uint8Array): ParsedWebp {
  if (bytes.length < 12 || !asciiAt(bytes, 0, "RIFF") || !asciiAt(bytes, 8, "WEBP")) {
    throw new MetadataError("INVALID_MAGIC_BYTES", "WebP RIFF/WEBP signature is missing.");
  }
  const declaredFileSize = readLe32(bytes, 4) + 8;
  if (declaredFileSize !== bytes.length) {
    throw new MetadataError("TRUNCATED_CONTAINER", "WebP RIFF size does not match the file length.");
  }
  const chunks: WebpChunk[] = [];
  let offset = 12;
  let metadataBytes = 0;
  for (let count = 0; count < MAX_CHUNKS && offset < bytes.length; count += 1) {
    if (offset + 8 > bytes.length) {
      throw new MetadataError("TRUNCATED_CONTAINER", "WebP chunk header is truncated.");
    }
    const type = readAscii(bytes, offset, 4);
    const length = readLe32(bytes, offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const end = dataEnd + (length & 1);
    if (!Number.isSafeInteger(end) || end > bytes.length) {
      throw new MetadataError("TRUNCATED_CONTAINER", `WebP ${type} chunk exceeds the RIFF boundary.`);
    }
    if ((length & 1) === 1 && bytes[dataEnd] !== 0) {
      throw new MetadataError("INVALID_SEGMENT_LENGTH", `WebP ${type} padding byte is invalid.`);
    }
    const data = bytes.subarray(dataStart, dataEnd);
    if (["C2PA", "XMP ", "EXIF", "ICCP"].includes(type)) {
      metadataBytes += length;
      if (metadataBytes > MAX_METADATA_BYTES) {
        throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "WebP metadata exceeds the safe processing limit.");
      }
    }
    chunks.push({
      type,
      start: offset,
      end,
      dataStart,
      dataEnd,
      data,
      aiXmp: type === "XMP " && containsConfirmedAiXmp(new TextDecoder().decode(data)),
    });
    offset = end;
  }
  if (offset !== bytes.length || chunks.length === 0) {
    throw new MetadataError("TRUNCATED_CONTAINER", "WebP chunks do not fill the RIFF container.");
  }
  const vp8x = chunks.find((chunk) => chunk.type === "VP8X");
  let width: number | undefined;
  let height: number | undefined;
  if (vp8x) {
    if (vp8x.data.length !== 10) {
      throw new MetadataError("INVALID_SEGMENT_LENGTH", "WebP VP8X must contain exactly 10 bytes.");
    }
    width = 1 + vp8x.data[4] + vp8x.data[5] * 0x100 + vp8x.data[6] * 0x10000;
    height = 1 + vp8x.data[7] + vp8x.data[8] * 0x100 + vp8x.data[9] * 0x10000;
  }
  return {
    chunks,
    declaredFileSize,
    width,
    height,
    animated: chunks.some((chunk) => chunk.type === "ANIM" || chunk.type === "ANMF"),
    hasAlpha: chunks.some((chunk) => chunk.type === "ALPH") || Boolean(vp8x && (vp8x.data[0] & 0x10)),
  };
}
