import type { SupportedFormat } from "../metadata/types";

const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;

export function sanitizeArchivePath(input: string): string {
  const normalized = input.replaceAll("\\", "/");
  const leaf = normalized.split("/").filter(Boolean).at(-1) ?? "file";
  let safe = leaf
    .replace(/[\u0000-\u001f\u007f<>:"|?*]/g, "-")
    .replace(/^\.+/, "")
    .replace(/[. ]+$/g, "")
    .slice(0, 180);
  if (!safe || WINDOWS_RESERVED.test(safe)) safe = "file";
  return safe;
}

export function cleanedFileName(originalName: string, format: SupportedFormat): string {
  const safe = sanitizeArchivePath(originalName);
  const stem = safe.replace(/\.[^.]*$/, "") || "image";
  const extension = format === "jpeg" ? "jpg" : format;
  return `${stem}-clean.${extension}`;
}
