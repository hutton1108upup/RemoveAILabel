import { describe, expect, it } from "vitest";
import { cleanWebp } from "@/lib/metadata/formats/webp/clean";
import { parseWebp } from "@/lib/metadata/formats/webp/parse";
import { payloadHash } from "@/lib/metadata/payload-hash";
import { ascii, buildWebp, vp8x, webpChunk } from "@/tests/fixtures/builders";

describe("WebP inspect-only release gate", () => {
  it.each([
    ["VP8 ", [webpChunk("VP8 ", Uint8Array.of(1, 2, 3))]],
    ["VP8L", [webpChunk("VP8L", Uint8Array.of(0x2f, 1, 2, 3))]],
    ["alpha", [vp8x(0x10), webpChunk("ALPH", Uint8Array.of(1)), webpChunk("VP8 ", Uint8Array.of(2))]],
    ["animation", [vp8x(0x02), webpChunk("ANIM", new Uint8Array(6)), webpChunk("ANMF", Uint8Array.of(1))]],
    ["ICCP", [vp8x(0x20), webpChunk("ICCP", ascii("profile")), webpChunk("VP8 ", Uint8Array.of(1))]],
    ["EXIF", [vp8x(0x08), webpChunk("EXIF", ascii("camera")), webpChunk("VP8 ", Uint8Array.of(1))]],
    ["XMP", [vp8x(0x04), webpChunk("XMP ", ascii("<ai:prompt>tree</ai:prompt>")), webpChunk("VP8 ", Uint8Array.of(1))]],
    ["C2PA", [webpChunk("C2PA", ascii("manifest")), webpChunk("VP8 ", Uint8Array.of(1))]],
  ] as const)("parses %s fixture including odd padding", (_name, chunks) => {
    expect(parseWebp(buildWebp({ chunks: [...chunks] })).chunks.length).toBe(chunks.length);
  });

  it("refuses cleaning unless the feature gate is explicitly enabled", () => {
    const input = buildWebp({ chunks: [webpChunk("C2PA", ascii("manifest")), webpChunk("VP8 ", Uint8Array.of(1))] });
    expect(() => cleanWebp(input, { removeC2pa: true, removeAiXmp: true, privacyClean: false, enabled: false, c2paConfirmed: true })).toThrow(
      /SAFE_REWRITE_NOT_SUPPORTED/,
    );
  });

  it("updates RIFF size and VP8X metadata flags while preserving alpha, animation, ICC, and payload", async () => {
    const input = buildWebp({
      chunks: [
        vp8x(0x3e),
        webpChunk("ICCP", ascii("profile")),
        webpChunk("ALPH", Uint8Array.of(9)),
        webpChunk("ANIM", new Uint8Array(6)),
        webpChunk("ANMF", Uint8Array.of(1, 2, 3)),
        webpChunk("EXIF", ascii("camera")),
        webpChunk("XMP ", ascii("<ai:prompt>tree</ai:prompt>")),
        webpChunk("C2PA", ascii("manifest")),
      ],
    });
    const cleaned = cleanWebp(input, {
      removeC2pa: true,
      removeAiXmp: true,
      privacyClean: false,
      enabled: true,
      c2paConfirmed: true,
    });
    const parsed = parseWebp(cleaned);
    const vp8xChunk = parsed.chunks.find((chunk) => chunk.type === "VP8X");
    expect(parsed.declaredFileSize).toBe(cleaned.length);
    expect(vp8xChunk?.data[0]).toBe(0x3a);
    expect(parsed.chunks.map((chunk) => chunk.type)).toEqual(
      expect.arrayContaining(["ICCP", "ALPH", "ANIM", "ANMF", "EXIF"]),
    );
    expect(parsed.chunks.map((chunk) => chunk.type)).not.toEqual(expect.arrayContaining(["C2PA", "XMP "]));
    expect(await payloadHash(input, "webp")).toBe(await payloadHash(cleaned, "webp"));
  });

  it("rejects invalid RIFF sizes", () => {
    expect(() => parseWebp(buildWebp({ invalidRiffSize: true }))).toThrow(/TRUNCATED_CONTAINER/);
  });
});
