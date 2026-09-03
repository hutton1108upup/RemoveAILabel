import { concatBytes, writeLe32 } from "../../bytes";
import { MetadataError } from "../../errors";
import { parseWebp, type WebpChunk } from "./parse";

export interface WebpCleanOptions {
  removeC2pa: boolean;
  removeAiXmp: boolean;
  privacyClean: boolean;
  enabled: boolean;
  c2paConfirmed: boolean;
}

function chunkBytes(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  return concatBytes(
    typeBytes,
    writeLe32(data.length),
    data,
    data.length & 1 ? Uint8Array.of(0) : new Uint8Array(),
  );
}

function updatedVp8x(chunk: WebpChunk, retained: WebpChunk[]): Uint8Array {
  const data = chunk.data.slice();
  let flags = data[0] & ~(0x20 | 0x08 | 0x04);
  if (retained.some((candidate) => candidate.type === "ICCP")) flags |= 0x20;
  if (retained.some((candidate) => candidate.type === "EXIF")) flags |= 0x08;
  if (retained.some((candidate) => candidate.type === "XMP ")) flags |= 0x04;
  data[0] = flags;
  return chunkBytes("VP8X", data);
}

export function cleanWebp(bytes: Uint8Array, options: WebpCleanOptions): Uint8Array {
  if (!options.enabled) {
    throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "WebP cleaning is inspect-only until its release gate is enabled.");
  }
  const parsed = parseWebp(bytes);
  if (
    options.removeC2pa &&
    options.c2paConfirmed &&
    !parsed.chunks.some((chunk) => chunk.type === "C2PA")
  ) {
    throw new MetadataError("C2PA_DETECTED_RANGE_UNKNOWN", "Confirmed WebP C2PA has no removable C2PA chunk.");
  }
  const retained = parsed.chunks.filter((chunk) => {
    if (options.removeC2pa && options.c2paConfirmed && chunk.type === "C2PA") return false;
    if (options.removeAiXmp && chunk.type === "XMP " && chunk.aiXmp) return false;
    if (options.privacyClean && chunk.type === "EXIF") return false;
    return true;
  });
  const rebuiltChunks = retained.map((chunk) =>
    chunk.type === "VP8X"
      ? updatedVp8x(chunk, retained)
      : bytes.subarray(chunk.start, chunk.end),
  );
  const body = concatBytes(new TextEncoder().encode("WEBP"), ...rebuiltChunks);
  return concatBytes(new TextEncoder().encode("RIFF"), writeLe32(body.length), body);
}
