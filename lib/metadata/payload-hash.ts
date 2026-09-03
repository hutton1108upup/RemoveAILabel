import { concatBytes } from "./bytes";
import { parseJpeg } from "./formats/jpeg/parse";
import { parsePng } from "./formats/png/parse";
import { parseWebp } from "./formats/webp/parse";
import type { SupportedFormat } from "./types";

function payloadBytes(bytes: Uint8Array, format: SupportedFormat): Uint8Array {
  if (format === "jpeg") {
    const parsed = parseJpeg(bytes);
    return bytes.subarray(parsed.payloadStart);
  }
  if (format === "png") {
    const parsed = parsePng(bytes);
    return concatBytes(
      ...parsed.chunks
        .filter((chunk) => chunk.type === "IDAT" || chunk.type === "fdAT")
        .map((chunk) => chunk.data),
    );
  }
  const parsed = parseWebp(bytes);
  return concatBytes(
    ...parsed.chunks
      .filter((chunk) => ["VP8 ", "VP8L", "ALPH", "ANIM", "ANMF"].includes(chunk.type))
      .map((chunk) => chunk.data),
  );
}

export async function payloadHash(bytes: Uint8Array, format: SupportedFormat): Promise<string> {
  const payload = payloadBytes(bytes, format).slice();
  const digest = await globalThis.crypto.subtle.digest("SHA-256", payload.buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
