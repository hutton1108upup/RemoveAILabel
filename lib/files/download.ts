import type { ProcessFileResult, VerifiedDownload } from "../metadata/types";

export function asVerifiedDownload(result: ProcessFileResult): VerifiedDownload | undefined {
  if (
    result.status !== "ready" ||
    !result.verification?.verified ||
    !result.cleanedBytes ||
    !result.cleanedFileName
  ) {
    return undefined;
  }
  return {
    fileName: result.cleanedFileName,
    bytes: result.cleanedBytes,
    verified: true,
  };
}
