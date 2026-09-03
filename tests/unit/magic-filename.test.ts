import { describe, expect, it } from "vitest";
import { detectFormat } from "@/lib/files/magic-bytes";
import { cleanedFileName, sanitizeArchivePath } from "@/lib/files/filename";
import { buildJpeg, buildPng, buildWebp } from "@/tests/fixtures/builders";

describe("magic byte detection", () => {
  it.each([
    [buildJpeg(), "jpeg"],
    [buildPng(), "png"],
    [buildWebp(), "webp"],
  ] as const)("detects real container regardless of extension", (bytes, expected) => {
    expect(detectFormat(bytes)).toBe(expected);
  });

  it("rejects extension-only spoofing", () => {
    expect(() => detectFormat(new TextEncoder().encode("not a jpeg"))).toThrow(
      /INVALID_MAGIC_BYTES/,
    );
  });
});

describe("safe output names", () => {
  it("removes traversal, absolute path, control, and reserved components", () => {
    expect(sanitizeArchivePath("../..\\CON\u0000/portrait.jpg")).toBe("portrait.jpg");
    expect(sanitizeArchivePath("../../secret.png")).toBe("secret.png");
  });

  it("adds a clean suffix without trusting a spoofed extension", () => {
    expect(cleanedFileName("../../../photo.png", "jpeg")).toBe("photo-clean.jpg");
  });
});
