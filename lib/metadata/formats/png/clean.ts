import { concatBytes, writeBe32 } from "../../bytes";
import { MetadataError } from "../../errors";
import { minimalTiffWithOrientation } from "../../exif";
import { parsePng, pngCrc32 } from "./parse";

export interface PngCleanOptions {
  removeC2pa: boolean;
  removeAiText: boolean;
  privacyClean: boolean;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const body = concatBytes(typeBytes, data);
  return concatBytes(writeBe32(data.length), body, writeBe32(pngCrc32(body)));
}

export function cleanPng(bytes: Uint8Array, options: PngCleanOptions): Uint8Array {
  const parsed = parsePng(bytes);
  if (
    options.privacyClean &&
    parsed.chunks.some((chunk) => chunk.type === "eXIf") &&
    (!parsed.exifOrientationSafe || parsed.orientation == null)
  ) {
    throw new MetadataError(
      "SAFE_REWRITE_NOT_SUPPORTED",
      "PNG eXIf orientation is missing, malformed, or conflicting and cannot be rebuilt safely.",
    );
  }
  let orientationInserted = false;
  return concatBytes(
    bytes.subarray(0, 8),
    ...parsed.chunks
      .flatMap((chunk) => {
        if (options.removeC2pa && chunk.type === "caBX") return [];
        if (options.removeAiText && chunk.text?.isConfirmedAi) return [];
        if (options.privacyClean && chunk.type === "eXIf") {
          if (orientationInserted) return [];
          orientationInserted = true;
          return [pngChunk("eXIf", minimalTiffWithOrientation(parsed.orientation as number))];
        }
        return [bytes.subarray(chunk.start, chunk.end)];
      })
  );
}
