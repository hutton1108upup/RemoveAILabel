import type { ProcessingErrorCode } from "./types";

export class MetadataError extends Error {
  constructor(
    public readonly code: ProcessingErrorCode,
    message: string,
  ) {
    super(`${code}: ${message}`);
    this.name = "MetadataError";
  }
}

export function toMetadataError(error: unknown): MetadataError {
  if (error instanceof MetadataError) return error;
  if (error instanceof RangeError && /memory|length|allocation/i.test(error.message)) {
    return new MetadataError("OUT_OF_MEMORY", "The file could not be processed within available memory.");
  }
  return new MetadataError(
    "UNKNOWN",
    error instanceof Error ? error.message : "Unexpected metadata processing error.",
  );
}
