import { unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { createVerifiedZip } from "@/lib/files/zip";

describe("verified-only ZIP", () => {
  it("archives only verified clean results and sanitizes traversal names", () => {
    const bytes = createVerifiedZip([
      {
        fileName: "../safe.jpg",
        bytes: Uint8Array.of(1, 2),
        verified: true,
      },
      undefined,
      {
        fileName: "nested/../../also-safe.png",
        bytes: Uint8Array.of(3),
        verified: true,
      },
    ]);
    expect(Object.keys(unzipSync(bytes)).sort()).toEqual(["also-safe.png", "safe.jpg"]);
  });

  it("rejects an empty verified set", () => {
    expect(() => createVerifiedZip([undefined])).toThrow(/ZIP_FAILED/);
  });
});
