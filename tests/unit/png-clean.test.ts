import { describe, expect, it } from "vitest";
import { cleanPng } from "@/lib/metadata/formats/png/clean";
import { parsePng } from "@/lib/metadata/formats/png/parse";
import { payloadHash } from "@/lib/metadata/payload-hash";
import {
  ascii,
  buildPng,
  pngChunk,
  pngExif,
  pngItxt,
  pngMalformedExif,
  pngText,
  pngZtxt,
} from "@/tests/fixtures/builders";

describe("PNG parser and confirmed-target cleanup", () => {
  it("removes caBX and explicit tEXt/iTXt/zTXt AI fields while preserving general XMP", async () => {
    const input = buildPng({
      chunks: [
        pngChunk("caBX", ascii("synthetic-c2pa")),
        pngText("parameters", "Steps: 20, Sampler: Euler"),
        pngItxt("workflow", '{"nodes":[]}'),
        pngZtxt("prompt", "a lighthouse"),
        pngItxt("XML:com.adobe.xmp", "<x:xmpmeta><xmp:CreatorTool>Photoshop</xmp:CreatorTool></x:xmpmeta>"),
      ],
    });
    const cleaned = cleanPng(input, { removeC2pa: true, removeAiText: true, privacyClean: false });
    const parsed = parsePng(cleaned);

    expect(parsed.chunks.some((chunk) => chunk.type === "caBX")).toBe(false);
    expect(parsed.textChunks.filter((chunk) => chunk.text.isConfirmedAi)).toHaveLength(0);
    expect(parsed.textChunks).toHaveLength(1);
    expect(await payloadHash(input, "png")).toBe(await payloadHash(cleaned, "png"));
  });

  it("removes an XMP iTXt only when an explicit AI field exists", () => {
    const aiXmp = pngItxt(
      "XML:com.adobe.xmp",
      "<x:xmpmeta><comfyui:workflow>{}</comfyui:workflow></x:xmpmeta>",
    );
    const cleaned = cleanPng(buildPng({ chunks: [aiXmp] }), {
      removeC2pa: false,
      removeAiText: true,
      privacyClean: false,
    });
    expect(parsePng(cleaned).textChunks).toHaveLength(0);
  });

  it("preserves camera and creator XMP containing Model, LensModel, Creator, and Software", () => {
    const cameraXmp = pngItxt(
      "XML:com.adobe.xmp",
      "<x:xmpmeta><tiff:Model>Canon EOS R5</tiff:Model><aux:LensModel>RF24-70</aux:LensModel><dc:creator>Ada</dc:creator><tiff:Software>Camera Firmware</tiff:Software></x:xmpmeta>",
    );
    const cleaned = cleanPng(buildPng({ chunks: [cameraXmp] }), {
      removeC2pa: false,
      removeAiText: true,
      privacyClean: false,
    });
    expect(parsePng(cleaned).textChunks).toHaveLength(1);
    expect(parsePng(cleaned).textChunks[0].text.isConfirmedAi).toBe(false);
  });

  it.each([6, 8])("reads and preserves PNG eXIf orientation %s in privacy mode", (orientation) => {
    const input = buildPng({ chunks: [pngExif(orientation)] });
    expect(parsePng(input).orientation).toBe(orientation);
    const cleaned = cleanPng(input, { removeC2pa: false, removeAiText: false, privacyClean: true });
    const parsed = parsePng(cleaned);
    expect(parsed.orientation).toBe(orientation);
    expect(parsed.chunks.filter((chunk) => chunk.type === "eXIf")).toHaveLength(1);
    expect(parsed.chunks.find((chunk) => chunk.type === "eXIf")?.data).toHaveLength(26);
  });

  it("fails closed for malformed or conflicting PNG eXIf orientation", () => {
    expect(() =>
      cleanPng(buildPng({ chunks: [pngMalformedExif()] }), {
        removeC2pa: false,
        removeAiText: false,
        privacyClean: true,
      }),
    ).toThrow(/SAFE_REWRITE_NOT_SUPPORTED/);
    expect(() =>
      cleanPng(buildPng({ chunks: [pngExif(6), pngExif(8)] }), {
        removeC2pa: false,
        removeAiText: false,
        privacyClean: true,
      }),
    ).toThrow(/SAFE_REWRITE_NOT_SUPPORTED/);
  });

  it("preserves eXIf/iCCP/transparency/APNG and animation payload", () => {
    const input = buildPng({
      colorType: 6,
      apng: true,
      chunks: [
        pngChunk("eXIf", ascii("camera")),
        pngChunk("iCCP", ascii("profile\0\0data")),
        pngChunk("tRNS", Uint8Array.of(0)),
      ],
    });
    const cleaned = cleanPng(input, { removeC2pa: true, removeAiText: true, privacyClean: false });
    const types = parsePng(cleaned).chunks.map((chunk) => chunk.type);
    expect(types).toEqual(expect.arrayContaining(["eXIf", "iCCP", "tRNS", "acTL", "fcTL", "fdAT", "IDAT"]));
  });

  it("replaces full eXIf with minimal orientation in privacy mode", () => {
    const input = buildPng({ chunks: [pngExif(1)] });
    const cleaned = cleanPng(input, { removeC2pa: false, removeAiText: false, privacyClean: true });
    const exif = parsePng(cleaned).chunks.find((chunk) => chunk.type === "eXIf");
    expect(exif?.data).toHaveLength(26);
    expect(parsePng(cleaned).orientation).toBe(1);
  });

  it("rejects CRC corruption and oversized text chunks", () => {
    expect(() => parsePng(buildPng({ corruptIdatCrc: true }))).toThrow(/TRUNCATED_CONTAINER|INVALID_SEGMENT_LENGTH/);
    const hugeText = pngText("prompt", "x".repeat(4 * 1024 * 1024 + 1));
    expect(() => parsePng(buildPng({ chunks: [hugeText] }))).toThrow(/SAFE_REWRITE_NOT_SUPPORTED/);
  });
});
