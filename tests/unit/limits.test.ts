import { describe, expect, it } from "vitest";
import {
  DESKTOP_BATCH_LIMIT,
  MAX_FILE_BYTES,
  MOBILE_BATCH_LIMIT,
  assertBatchSize,
  assertFileSize,
} from "@/lib/files/limits";

function sizedFiles(...sizes: number[]) {
  return sizes.map((byteLength) => ({ bytes: { byteLength } })) as unknown as Array<{
    bytes: Uint8Array;
  }>;
}

describe("browser processing limits", () => {
  it("accepts 25 MB and rejects a single byte over the file limit", () => {
    expect(() => assertFileSize(MAX_FILE_BYTES)).not.toThrow();
    expect(() => assertFileSize(MAX_FILE_BYTES + 1)).toThrow(/FILE_TOO_LARGE/);
  });

  it("enforces both desktop file-count and 200 MB byte limits", () => {
    expect(() => assertBatchSize(sizedFiles(...Array(30).fill(1)))).not.toThrow();
    expect(() => assertBatchSize(sizedFiles(...Array(31).fill(1)))).toThrow(/BATCH_TOO_LARGE/);
    expect(() => assertBatchSize(sizedFiles(DESKTOP_BATCH_LIMIT.bytes))).not.toThrow();
    expect(() => assertBatchSize(sizedFiles(DESKTOP_BATCH_LIMIT.bytes + 1))).toThrow(/BATCH_TOO_LARGE/);
  });

  it("enforces both mobile file-count and 100 MB byte limits", () => {
    expect(() => assertBatchSize(sizedFiles(...Array(10).fill(1)), true)).not.toThrow();
    expect(() => assertBatchSize(sizedFiles(...Array(11).fill(1)), true)).toThrow(/BATCH_TOO_LARGE/);
    expect(() => assertBatchSize(sizedFiles(MOBILE_BATCH_LIMIT.bytes), true)).not.toThrow();
    expect(() => assertBatchSize(sizedFiles(MOBILE_BATCH_LIMIT.bytes + 1), true)).toThrow(/BATCH_TOO_LARGE/);
  });
});
