import { asciiAt } from "../metadata/bytes";
import { MetadataError } from "../metadata/errors";
import type { SupportedFormat } from "../metadata/types";

const PNG_SIGNATURE = Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);

export function detectFormat(bytes: Uint8Array): SupportedFormat {
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return "jpeg";
  if (
    bytes.length >= PNG_SIGNATURE.length &&
    PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)
  ) {
    return "png";
  }
  if (bytes.length >= 12 && asciiAt(bytes, 0, "RIFF") && asciiAt(bytes, 8, "WEBP")) {
    return "webp";
  }
  throw new MetadataError("INVALID_MAGIC_BYTES", "The file signature is not a supported image container.");
}

export function mimeTypeForFormat(format: SupportedFormat): string {
  if (format === "jpeg") return "image/jpeg";
  return `image/${format}`;
}
