import { zipSync } from "fflate";
import { MetadataError } from "../metadata/errors";
import type { VerifiedDownload } from "../metadata/types";
import { sanitizeArchivePath } from "./filename";

export function createVerifiedZip(
  files: readonly (VerifiedDownload | undefined)[],
): Uint8Array {
  const entries: Record<string, Uint8Array> = Object.create(null) as Record<string, Uint8Array>;
  for (const file of files) {
    if (!file?.verified) continue;
    let name = sanitizeArchivePath(file.fileName);
    let suffix = 2;
    while (Object.hasOwn(entries, name)) {
      const dot = name.lastIndexOf(".");
      const stem = dot > 0 ? name.slice(0, dot) : name;
      const extension = dot > 0 ? name.slice(dot) : "";
      name = `${stem}-${suffix}${extension}`;
      suffix += 1;
    }
    entries[name] = file.bytes;
  }
  if (Object.keys(entries).length === 0) {
    throw new MetadataError("ZIP_FAILED", "No verified clean files are eligible for the ZIP.");
  }
  try {
    return zipSync(entries, { level: 0 });
  } catch (error) {
    throw new MetadataError(
      "ZIP_FAILED",
      error instanceof Error ? error.message : "Could not build the ZIP archive.",
    );
  }
}
