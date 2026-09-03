import { MetadataError } from "../metadata/errors";

export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const DESKTOP_BATCH_LIMIT = { files: 30, bytes: 200 * 1024 * 1024 } as const;
export const MOBILE_BATCH_LIMIT = { files: 10, bytes: 100 * 1024 * 1024 } as const;

export function assertFileSize(byteLength: number): void {
  if (!Number.isSafeInteger(byteLength) || byteLength < 0 || byteLength > MAX_FILE_BYTES) {
    throw new MetadataError("FILE_TOO_LARGE", "Each file must be 25 MB or smaller.");
  }
}

export function assertBatchSize(
  files: readonly { bytes: Uint8Array }[],
  mobile = false,
): void {
  const limit = mobile ? MOBILE_BATCH_LIMIT : DESKTOP_BATCH_LIMIT;
  const total = files.reduce((sum, file) => sum + file.bytes.byteLength, 0);
  if (files.length > limit.files || total > limit.bytes) {
    throw new MetadataError("BATCH_TOO_LARGE", "The batch exceeds the reliable browser-processing limit.");
  }
}
