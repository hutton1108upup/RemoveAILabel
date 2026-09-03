import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cleanJpeg } from "@/lib/metadata/formats/jpeg/clean";
import { parseJpeg } from "@/lib/metadata/formats/jpeg/parse";
import { payloadHash } from "@/lib/metadata/payload-hash";
import { scanBytes } from "@/lib/metadata/scan";
import {
  buildJpeg,
  concatBytes,
  jpegApp13,
  jpegC2paApp11Segments,
  jpegExif,
  jpegExtendedXmp,
  jpegIcc,
  jpegMalformedExif,
  jpegNonC2paApp11,
  jpegXmp,
} from "@/tests/fixtures/builders";

describe("JPEG parser and confirmed-target cleanup", () => {
  it("removes only the real C2PA APP11 group from the attributed official fixture", async () => {
    const input = new Uint8Array(
      readFileSync(new URL("../fixtures/official/adobe-20220124-CA.jpg", import.meta.url)),
    );
    const parsedBefore = parseJpeg(input);
    const scanBefore = await scanBytes(
      { id: "official-c2pa", fileName: "adobe-20220124-CA.jpg", bytes: input },
      { inspectC2pa: async () => ({ status: "present", generativeAi: false }) },
    );
    expect(parsedBefore.c2paGroups.length).toBeGreaterThan(0);
    expect(parsedBefore.hasAmbiguousC2paRanges).toBe(false);
    expect(scanBefore.hasEmbeddedC2pa).toBe(true);

    const cleaned = cleanJpeg(input, {
      removeC2pa: true,
      removeAiXmp: false,
      privacyClean: false,
      c2paConfirmed: true,
    });
    const parsedAfter = parseJpeg(cleaned);
    expect(parsedAfter.c2paGroups).toHaveLength(0);
    expect(parsedAfter.segments.filter((segment) => segment.kind === "app11-other")).toHaveLength(
      parsedBefore.segments.filter((segment) => segment.kind === "app11-other").length,
    );
    expect(await payloadHash(cleaned, "jpeg")).toBe(await payloadHash(input, "jpeg"));
  });

  it("removes one complete cross-segment C2PA APP11 group but preserves adjacent non-C2PA APP11", async () => {
    const nonC2pa = jpegNonC2paApp11();
    const input = buildJpeg({
      segments: [nonC2pa, ...jpegC2paApp11Segments(17)],
    });
    const cleaned = cleanJpeg(input, {
      removeC2pa: true,
      removeAiXmp: true,
      privacyClean: false,
      c2paConfirmed: true,
    });
    const parsed = parseJpeg(cleaned);

    expect(parsed.c2paGroups).toHaveLength(0);
    expect(parsed.segments.some((segment) => segment.kind === "app11-other")).toBe(true);
    expect(await payloadHash(input, "jpeg")).toBe(await payloadHash(cleaned, "jpeg"));
  });

  it("preserves standalone JPEG markers and fill bytes outside removed target ranges", () => {
    const structuralBytes = Uint8Array.of(0xff, 0x01, 0xff, 0xff, 0xe0, 0x00, 0x02);
    const input = buildJpeg({
      segments: [structuralBytes, jpegNonC2paApp11(), ...jpegC2paApp11Segments()],
    });
    const cleaned = cleanJpeg(input, {
      removeC2pa: true,
      removeAiXmp: false,
      privacyClean: false,
      c2paConfirmed: true,
    });
    expect(cleaned.subarray(2, 9)).toEqual(structuralBytes);
  });

  it("fails closed for a truncated or non-contiguous C2PA fragment group", () => {
    const [first, second] = jpegC2paApp11Segments(17);
    const ambiguous = buildJpeg({ segments: [first, jpegExif(1), second] });
    expect(() =>
      cleanJpeg(ambiguous, {
        removeC2pa: true,
        removeAiXmp: true,
        privacyClean: false,
        c2paConfirmed: true,
      }),
    ).toThrow(/C2PA_DETECTED_RANGE_UNKNOWN/);
  });

  it("removes confirmed AI standard and associated Extended XMP while preserving general XMP", () => {
    const guid = "1234567890ABCDEF1234567890ABCDEF";
    const targetXmp = jpegXmp(
      `<x:xmpmeta xmpNote:HasExtendedXMP="${guid}"><ai:prompt>castle</ai:prompt></x:xmpmeta>`,
    );
    const extended = jpegExtendedXmp(guid, 0, "<ai:workflow>{}</ai:workflow>");
    const general = jpegXmp("<x:xmpmeta><xmp:CreatorTool>Photoshop</xmp:CreatorTool></x:xmpmeta>");
    const cleaned = cleanJpeg(buildJpeg({ segments: [jpegExif(6), targetXmp, extended, general] }), {
      removeC2pa: true,
      removeAiXmp: true,
      privacyClean: false,
      c2paConfirmed: false,
    });
    const parsed = parseJpeg(cleaned);

    expect(parsed.segments.filter((segment) => segment.kind === "xmp")).toHaveLength(1);
    expect(parsed.segments.some((segment) => segment.kind === "extended-xmp")).toBe(false);
    expect(parsed.orientation).toBe(6);
  });

  it("preserves camera and creator XMP containing Model, LensModel, Creator, and Software", () => {
    const cameraXmp = jpegXmp(
      "<x:xmpmeta><tiff:Model>Canon EOS R5</tiff:Model><aux:LensModel>RF24-70</aux:LensModel><dc:creator>Ada</dc:creator><tiff:Software>Camera Firmware</tiff:Software></x:xmpmeta>",
    );
    const cleaned = cleanJpeg(buildJpeg({ segments: [cameraXmp] }), {
      removeC2pa: false,
      removeAiXmp: true,
      privacyClean: false,
      c2paConfirmed: false,
    });
    const parsed = parseJpeg(cleaned);
    expect(parsed.segments.filter((segment) => segment.kind === "xmp")).toHaveLength(1);
    expect(parsed.segments.find((segment) => segment.kind === "xmp")?.xmpAi).toBe(false);
  });

  it("removes a standard XMP pointer and complete Extended XMP when AI appears only in the extension", () => {
    const guid = "ABCDEF1234567890ABCDEF1234567890";
    const standard = jpegXmp(
      `<x:xmpmeta xmpNote:HasExtendedXMP="${guid}"><dc:creator>Ada</dc:creator></x:xmpmeta>`,
    );
    const extendedXml = "<x:xmpmeta><comfyui:workflow>{}</comfyui:workflow></x:xmpmeta>";
    const cut = 21;
    const cleaned = cleanJpeg(
      buildJpeg({
        segments: [
          standard,
          jpegExtendedXmp(guid, 0, extendedXml.slice(0, cut), extendedXml.length),
          jpegExtendedXmp(guid, cut, extendedXml.slice(cut), extendedXml.length),
        ],
      }),
      { removeC2pa: false, removeAiXmp: true, privacyClean: false, c2paConfirmed: false },
    );
    const parsed = parseJpeg(cleaned);
    expect(parsed.segments.some((segment) => segment.kind === "xmp")).toBe(false);
    expect(parsed.segments.some((segment) => segment.kind === "extended-xmp")).toBe(false);
  });

  it("preserves complete general Extended XMP and its standard pointer", () => {
    const guid = "0123456789ABCDEF0123456789ABCDEF";
    const standard = jpegXmp(`<x:xmpmeta xmpNote:HasExtendedXMP="${guid}" />`);
    const extended = jpegExtendedXmp(guid, 0, "<dc:description>studio portrait</dc:description>");
    const cleaned = cleanJpeg(buildJpeg({ segments: [standard, extended] }), {
      removeC2pa: false,
      removeAiXmp: true,
      privacyClean: false,
      c2paConfirmed: false,
    });
    expect(parseJpeg(cleaned).segments.filter((segment) => segment.kind.includes("xmp"))).toHaveLength(2);
  });

  it("fails closed for incomplete or overlapping AI Extended XMP fragments", () => {
    const guid = "FEDCBA0987654321FEDCBA0987654321";
    const standard = jpegXmp(`<x:xmpmeta xmpNote:HasExtendedXMP="${guid}" />`);
    const aiFragment = "<comfyui:workflow>{}</comfyui:workflow>";
    const incomplete = buildJpeg({
      segments: [standard, jpegExtendedXmp(guid, 0, aiFragment, aiFragment.length + 10)],
    });
    expect(() =>
      cleanJpeg(incomplete, {
        removeC2pa: false,
        removeAiXmp: true,
        privacyClean: false,
        c2paConfirmed: false,
      }),
    ).toThrow(/SAFE_REWRITE_NOT_SUPPORTED/);

    const overlapping = buildJpeg({
      segments: [
        standard,
        jpegExtendedXmp(guid, 0, aiFragment.slice(0, 25), aiFragment.length),
        jpegExtendedXmp(guid, 20, aiFragment.slice(20), aiFragment.length),
      ],
    });
    expect(() =>
      cleanJpeg(overlapping, {
        removeC2pa: false,
        removeAiXmp: true,
        privacyClean: false,
        c2paConfirmed: false,
      }),
    ).toThrow(/SAFE_REWRITE_NOT_SUPPORTED/);
  });

  it.each([1, 6, 8])("preserves EXIF orientation %s in privacy mode using minimal EXIF", (orientation) => {
    const input = buildJpeg({ segments: [jpegExif(orientation)] });
    const cleaned = cleanJpeg(input, {
      removeC2pa: true,
      removeAiXmp: true,
      privacyClean: true,
      c2paConfirmed: false,
    });
    const parsed = parseJpeg(cleaned);
    expect(parsed.orientation).toBe(orientation);
    expect(parsed.segments.filter((segment) => segment.kind === "exif")).toHaveLength(1);
  });

  it("fails closed in privacy mode when EXIF orientation cannot be determined", () => {
    const input = buildJpeg({ segments: [jpegMalformedExif()] });
    expect(() =>
      cleanJpeg(input, {
        removeC2pa: false,
        removeAiXmp: false,
        privacyClean: true,
        c2paConfirmed: false,
      }),
    ).toThrow(/SAFE_REWRITE_NOT_SUPPORTED/);
  });

  it("fails closed when any of multiple EXIF packets has unknown orientation", () => {
    const input = buildJpeg({ segments: [jpegExif(6), jpegMalformedExif()] });
    expect(() =>
      cleanJpeg(input, {
        removeC2pa: false,
        removeAiXmp: false,
        privacyClean: true,
        c2paConfirmed: false,
      }),
    ).toThrow(/SAFE_REWRITE_NOT_SUPPORTED/);
  });

  it("preserves multi-segment ICC, APP13, progressive coding, and scan bytes", () => {
    const scanData = Uint8Array.of(1, 2, 0xff, 0x00, 3, 4);
    const input = buildJpeg({
      progressive: true,
      scanData,
      segments: [jpegIcc(1, 2, "one"), jpegIcc(2, 2, "two"), jpegApp13()],
    });
    const cleaned = cleanJpeg(input, {
      removeC2pa: true,
      removeAiXmp: true,
      privacyClean: false,
      c2paConfirmed: false,
    });
    const parsed = parseJpeg(cleaned);
    expect(parsed.progressive).toBe(true);
    expect(parsed.segments.filter((segment) => segment.kind === "icc")).toHaveLength(2);
    expect(parsed.segments.some((segment) => segment.kind === "app13")).toBe(true);
    expect(cleaned.subarray(parsed.payloadStart)).toEqual(input.subarray(parseJpeg(input).payloadStart));
  });

  it("rejects invalid segment lengths and truncated scans", () => {
    expect(() => parseJpeg(Uint8Array.of(0xff, 0xd8, 0xff, 0xe1, 0xff, 0xff))).toThrow(
      /INVALID_SEGMENT_LENGTH/,
    );
    expect(() => parseJpeg(buildJpeg({ truncated: true }))).toThrow(/TRUNCATED_CONTAINER/);
  });

  it("does not combine two independent C2PA groups", () => {
    const first = jpegC2paApp11Segments();
    const second = jpegC2paApp11Segments();
    const input = buildJpeg({ segments: concatBytes(...first).length ? [...first, jpegNonC2paApp11("gap"), ...second] : [] });
    expect(parseJpeg(input).c2paGroups).toHaveLength(2);
  });
});
