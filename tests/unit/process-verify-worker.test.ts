import { describe, expect, it } from "vitest";
import { canDownload, processFile } from "@/lib/metadata/process";
import { handleWorkerRequest } from "@/workers/metadata.worker";
import {
  ascii,
  buildJpeg,
  buildPng,
  buildWebp,
  jpegC2paApp11Segments,
  jpegExtendedXmp,
  jpegXmp,
  pngExif,
  pngMalformedExif,
  pngText,
  vp8x,
  webpChunk,
} from "@/tests/fixtures/builders";
import type { C2paInspector } from "@/lib/metadata/types";

const c2paPresent: C2paInspector = async () => ({ status: "present", generativeAi: true });
const c2paAbsent: C2paInspector = async () => ({ status: "absent", generativeAi: false });

describe("process and verification contract", () => {
  it("rescans cleanup, verifies payload hash, and makes only verified output downloadable", async () => {
    const result = await processFile(
      { id: "one", fileName: "photo.jpg", mimeType: "image/jpeg", bytes: buildJpeg({ segments: jpegC2paApp11Segments(17) }) },
      { inspectC2pa: c2paPresent, inspectCleanedC2pa: c2paAbsent },
    );
    expect(result.status).toBe("ready");
    expect(result.verification).toMatchObject({ verified: true, encodedPayloadUnchanged: true, c2paAbsentAfterCleanup: true });
    expect(result.verification?.remainingTargetFindingIds).toEqual([]);
    expect(canDownload(result)).toBe(true);
  });

  it("returns already-clean without rewriting", async () => {
    const result = await processFile(
      { id: "clean", fileName: "clean.png", mimeType: "image/png", bytes: buildPng() },
      { inspectC2pa: c2paAbsent },
    );
    expect(result.status).toBe("already-clean");
    expect(result.cleanedBytes).toBeUndefined();
    expect(canDownload(result)).toBe(false);
  });

  it("returns review-needed when C2PA range exists but official inspection is unavailable", async () => {
    const unavailable: C2paInspector = async () => ({ status: "unavailable", generativeAi: false, warning: "SDK unavailable" });
    const result = await processFile(
      { id: "review", fileName: "review.jpg", mimeType: "image/jpeg", bytes: buildJpeg({ segments: jpegC2paApp11Segments() }) },
      { inspectC2pa: unavailable },
    );
    expect(result.status).toBe("review-needed");
    expect(result.cleanedBytes).toBeUndefined();
  });

  it("withholds output when post-clean verification fails", async () => {
    const result = await processFile(
      { id: "badverify", fileName: "photo.jpg", mimeType: "image/jpeg", bytes: buildJpeg({ segments: jpegC2paApp11Segments() }) },
      { inspectC2pa: c2paPresent, inspectCleanedC2pa: c2paPresent },
    );
    expect(result.status).toBe("failed");
    expect(result.errorCode).toBe("VERIFICATION_FAILED");
    expect(result.cleanedBytes).toBeUndefined();
    expect(canDownload(result)).toBe(false);
  });

  it("treats a spoofed extension by its magic bytes", async () => {
    const result = await processFile(
      { id: "spoof", fileName: "actually-jpeg.png", mimeType: "image/png", bytes: buildJpeg() },
      { inspectC2pa: c2paAbsent },
    );
    expect(result.scan?.format).toBe("jpeg");
  });

  it.each([6, 8])("reports and verifies PNG orientation %s during privacy clean", async (orientation) => {
    const result = await processFile(
      {
        id: `png-orientation-${orientation}`,
        fileName: "camera.png",
        mimeType: "image/png",
        bytes: buildPng({ chunks: [pngExif(orientation)] }),
        options: { removeExifPrivacyData: true },
      },
      { inspectC2pa: c2paAbsent },
    );
    expect(result.scan?.orientation).toBe(orientation);
    expect(result.status).toBe("ready");
    expect(result.verification?.orientationPreserved).toBe(true);
    expect(canDownload(result)).toBe(true);
  });

  it.each([
    ["malformed", [pngMalformedExif()]],
    ["conflicting", [pngExif(6), pngExif(8)]],
  ] as const)("fails closed and withholds download for %s PNG eXIf privacy cleaning", async (_case, chunks) => {
    const result = await processFile(
      {
        id: "png-bad-orientation",
        fileName: "camera.png",
        mimeType: "image/png",
        bytes: buildPng({ chunks: [...chunks] }),
        options: { removeExifPrivacyData: true },
      },
      { inspectC2pa: c2paAbsent },
    );
    expect(result.status).toBe("failed");
    expect(result.errorCode).toBe("SAFE_REWRITE_NOT_SUPPORTED");
    expect(result.cleanedBytes).toBeUndefined();
    expect(canDownload(result)).toBe(false);
  });

  it("keeps WebP EXIF inspect-only by default with an explicit warning", async () => {
    const result = await processFile(
      {
        id: "webp-exif",
        fileName: "camera.webp",
        mimeType: "image/webp",
        bytes: buildWebp({
          chunks: [vp8x(0x08), webpChunk("VP8 ", Uint8Array.of(1)), webpChunk("EXIF", ascii("orientation-unknown"))],
        }),
        options: { removeExifPrivacyData: true },
      },
      { inspectC2pa: c2paAbsent },
    );
    expect(result.status).toBe("review-needed");
    expect(result.cleanedBytes).toBeUndefined();
    expect(result.scan?.warnings.join(" ")).toMatch(/inspect-only/i);
  });

  it("returns review-needed for incomplete associated Extended XMP", async () => {
    const guid = "AAAABBBBCCCCDDDDEEEEFFFF00001111";
    const fragment = "<comfyui:workflow>{}</comfyui:workflow>";
    const result = await processFile(
      {
        id: "unsafe-extended-xmp",
        fileName: "unsafe.jpg",
        mimeType: "image/jpeg",
        bytes: buildJpeg({
          segments: [
            jpegXmp(`<x:xmpmeta xmpNote:HasExtendedXMP="${guid}" />`),
            jpegExtendedXmp(guid, 0, fragment, fragment.length + 8),
          ],
        }),
      },
      { inspectC2pa: c2paAbsent },
    );
    expect(result.status).toBe("review-needed");
    expect(result.errorCode).toBe("SAFE_REWRITE_NOT_SUPPORTED");
    expect(result.cleanedBytes).toBeUndefined();
  });
});

describe("worker batch isolation", () => {
  it("keeps processing after one file fails", async () => {
    const response = await handleWorkerRequest(
      {
        type: "process-batch",
        requestId: "batch",
        files: [
          { id: "broken", fileName: "broken.jpg", mimeType: "image/jpeg", bytes: Uint8Array.of(0xff) },
          { id: "good", fileName: "good.png", mimeType: "image/png", bytes: buildPng({ chunks: [pngText("prompt", "bird")] }) },
        ],
      },
      { inspectC2pa: c2paAbsent },
    );
    expect(response.type).toBe("batch-result");
    if (response.type !== "batch-result") throw new Error("wrong response");
    expect(response.results.map((result) => result.status)).toEqual(["failed", "ready"]);
  });
});
