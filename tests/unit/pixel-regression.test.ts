import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { concatBytes } from "@/lib/metadata/bytes";
import { cleanJpeg } from "@/lib/metadata/formats/jpeg/clean";
import { cleanPng } from "@/lib/metadata/formats/png/clean";
import { parsePng } from "@/lib/metadata/formats/png/parse";
import { pngText } from "@/tests/fixtures/builders";

async function decodedRgba(bytes: Uint8Array) {
  const decoded = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return {
    width: decoded.info.width,
    height: decoded.info.height,
    channels: decoded.info.channels,
    hash: createHash("sha256").update(decoded.data).digest("hex"),
  };
}

describe("decoded pixel regression", () => {
  it("keeps official Adobe JPEG dimensions and decoded RGBA identical after C2PA removal", async () => {
    const input = new Uint8Array(
      await readFile(path.resolve("tests/fixtures/official/adobe-20220124-CA.jpg")),
    );
    const cleaned = cleanJpeg(input, {
      removeC2pa: true,
      removeAiXmp: false,
      privacyClean: false,
      c2paConfirmed: true,
    });

    expect(await decodedRgba(cleaned)).toEqual(await decodedRgba(input));
  });

  it("keeps valid transparent PNG dimensions and decoded RGBA identical after AI text removal", async () => {
    const base = new Uint8Array(
      await sharp({
        create: {
          width: 2,
          height: 2,
          channels: 4,
          background: { r: 13, g: 148, b: 135, alpha: 0.5 },
        },
      }).png().toBuffer(),
    );
    const iend = parsePng(base).chunks.find((chunk) => chunk.type === "IEND");
    expect(iend).toBeDefined();
    const input = concatBytes(
      base.subarray(0, iend!.start),
      pngText("parameters", "Steps: 20, Sampler: Euler, Seed: 42"),
      base.subarray(iend!.start),
    );
    const cleaned = cleanPng(input, {
      removeC2pa: false,
      removeAiText: true,
      privacyClean: false,
    });

    expect(await decodedRgba(cleaned)).toEqual(await decodedRgba(input));
  });
});
