import { detectFormat, mimeTypeForFormat } from "../files/magic-bytes";
import { inspectC2pa as defaultC2paInspector } from "./c2pa";
import { parseJpeg } from "./formats/jpeg/parse";
import { parsePng } from "./formats/png/parse";
import { parseWebp } from "./formats/webp/parse";
import { payloadHash } from "./payload-hash";
import type {
  C2paInspection,
  C2paInspector,
  MetadataFinding,
  ScanReport,
  SupportedFormat,
} from "./types";

export interface ScanBytesInput {
  id: string;
  fileName: string;
  mimeType?: string;
  bytes: Uint8Array;
}

export interface ScanDependencies {
  inspectC2pa?: C2paInspector;
  forceC2paInspection?: boolean;
}

function finding(
  id: string,
  partial: Omit<MetadataFinding, "id" | "explanation"> & { explanation?: string },
): MetadataFinding {
  return {
    id,
    explanation: partial.explanation ?? partial.label,
    ...partial,
  };
}

async function inspectC2paIfNeeded(
  format: SupportedFormat,
  bytes: Uint8Array,
  needed: boolean,
  inspector: C2paInspector | undefined,
): Promise<C2paInspection | undefined> {
  if (!needed) return undefined;
  return (inspector ?? defaultC2paInspector)(format, bytes);
}

export async function scanBytes(
  input: ScanBytesInput,
  dependencies: ScanDependencies = {},
): Promise<ScanReport> {
  const format = detectFormat(input.bytes);
  const findings: MetadataFinding[] = [];
  const warnings: string[] = [];
  let width: number | undefined;
  let height: number | undefined;
  let orientation: number | null | undefined;
  let hasIccProfile = false;
  let hasCameraExif = false;
  let hasCopyright = false;
  let c2paRangeSafe = false;
  let c2paSignal = false;
  let containerRewriteSafe = true;

  if (format === "jpeg") {
    const parsed = parseJpeg(input.bytes);
    width = parsed.width;
    height = parsed.height;
    orientation = parsed.orientation;
    c2paRangeSafe = parsed.c2paGroups.length > 0 && !parsed.hasAmbiguousC2paRanges;
    c2paSignal = parsed.c2paGroups.length > 0 || parsed.hasAmbiguousC2paRanges;
    containerRewriteSafe = !parsed.hasUnsafeExtendedXmp;
    const aiExtendedGuids = new Set(
      parsed.extendedXmpGroups.filter((group) => group.complete && group.ai).map((group) => group.guid),
    );
    parsed.segments.forEach((segment, index) => {
      if (
        segment.kind === "xmp" &&
        (segment.xmpAi || Boolean(segment.extendedGuid && aiExtendedGuids.has(segment.extendedGuid)))
      ) {
        findings.push(finding(`jpeg-xmp-${index}`, {
          category: "ai-xmp",
          source: "XMP",
          label: "AI-related XMP",
          level: "confirmed",
          removable: true,
          autoRemoveEligible: true,
        }));
      }
      if (segment.kind === "exif") hasCameraExif = true;
      if (segment.kind === "icc") hasIccProfile = true;
      if (segment.kind === "app13") hasCopyright = true;
    });
    if (parsed.hasUnsafeExtendedXmp) {
      findings.push(finding("jpeg-extended-xmp-unsafe", {
        category: "ai-xmp",
        source: "XMP",
        label: "Incomplete Extended XMP",
        level: "possible",
        removable: false,
        autoRemoveEligible: false,
        explanation: "Associated Extended XMP fragments are incomplete, overlapping, or inconsistent.",
      }));
      warnings.push("Extended XMP could not be reconstructed safely; automatic cleanup is blocked.");
    }
  } else if (format === "png") {
    const parsed = parsePng(input.bytes);
    width = parsed.width;
    height = parsed.height;
    orientation = parsed.orientation;
    c2paSignal = parsed.chunks.some((chunk) => chunk.type === "caBX");
    c2paRangeSafe = c2paSignal;
    parsed.textChunks.forEach((chunk, index) => {
      if (!chunk.text.isConfirmedAi) return;
      findings.push(finding(`png-text-${index}`, {
        category: chunk.text.isXmp ? "ai-xmp" : "ai-workflow",
        source: chunk.text.isXmp ? "XMP" : "PNG_TEXT",
        label: chunk.text.isXmp ? "AI-related XMP" : "Prompt or workflow metadata",
        level: "confirmed",
        removable: true,
        autoRemoveEligible: true,
      }));
    });
    hasCameraExif = parsed.chunks.some((chunk) => chunk.type === "eXIf");
    hasIccProfile = parsed.chunks.some((chunk) => chunk.type === "iCCP");
  } else {
    const parsed = parseWebp(input.bytes);
    width = parsed.width;
    height = parsed.height;
    c2paSignal = parsed.chunks.some((chunk) => chunk.type === "C2PA");
    c2paRangeSafe = c2paSignal;
    parsed.chunks.forEach((chunk, index) => {
      if (chunk.type === "XMP " && chunk.aiXmp) {
        findings.push(finding(`webp-xmp-${index}`, {
          category: "ai-xmp",
          source: "XMP",
          label: "AI-related XMP",
          level: "confirmed",
          removable: true,
          autoRemoveEligible: true,
        }));
      }
    });
    hasCameraExif = parsed.chunks.some((chunk) => chunk.type === "EXIF");
    hasIccProfile = parsed.chunks.some((chunk) => chunk.type === "ICCP");
    warnings.push("WebP cleaning is inspect-only by default; EXIF is not removed unless the release gate is explicitly enabled.");
  }

  const c2pa = await inspectC2paIfNeeded(
    format,
    input.bytes,
    c2paSignal || Boolean(dependencies.forceC2paInspection),
    dependencies.inspectC2pa,
  );
  if (c2pa?.warning) warnings.push(c2pa.warning);
  if (c2pa?.status === "present") {
    findings.push(finding(`${format}-c2pa`, {
      category: "c2pa",
      source: format === "webp" ? "WEBP_CHUNK" : "C2PA",
      label: "Embedded C2PA credentials",
      level: "confirmed",
      removable: c2paRangeSafe,
      autoRemoveEligible: c2paRangeSafe,
      explanation: c2paRangeSafe
        ? "The official reader confirmed C2PA and the container range is complete."
        : "C2PA was confirmed, but its byte range cannot be removed safely.",
    }));
  } else if (c2paSignal) {
    findings.push(finding(`${format}-c2pa-possible`, {
      category: "c2pa",
      source: format === "webp" ? "WEBP_CHUNK" : "C2PA",
      label: "Possible related metadata",
      level: "possible",
      removable: false,
      autoRemoveEligible: false,
      explanation: "A C2PA-like container marker exists but the official reader did not confirm a manifest.",
    }));
  }
  if (hasCameraExif) {
    findings.push(finding(`${format}-exif`, {
      category: "camera-exif",
      source: "EXIF",
      label: "Camera EXIF",
      level: "general",
      removable: true,
      autoRemoveEligible: false,
      explanation: "Camera metadata is preserved by default.",
    }));
  }
  if (hasIccProfile) {
    findings.push(finding(`${format}-icc`, {
      category: "color-profile",
      source: format === "webp" ? "WEBP_CHUNK" : format === "png" ? "PNG_TEXT" : "XMP",
      label: "ICC color profile",
      level: "general",
      removable: false,
      autoRemoveEligible: false,
      explanation: "The color profile is preserved.",
    }));
  }
  if (hasCopyright) {
    findings.push(finding(`${format}-copyright`, {
      category: "copyright",
      source: "IPTC",
      label: "Creator or copyright metadata",
      level: "general",
      removable: false,
      autoRemoveEligible: false,
      explanation: "Creator and copyright metadata is preserved when separable.",
    }));
  }
  const confirmed = findings.filter(
    (item) => item.level === "confirmed" && item.autoRemoveEligible,
  );
  return {
    fileId: input.id,
    fileName: input.fileName,
    format,
    mimeType: mimeTypeForFormat(format),
    bytes: input.bytes.byteLength,
    width,
    height,
    orientation,
    findings,
    hasEmbeddedC2pa: c2pa?.status === "present",
    hasConfirmedAiMetadata: confirmed.length > 0,
    hasPossibleAiMetadata: findings.some((item) => item.level === "possible") ||
      findings.some((item) => item.category === "c2pa" && item.level === "confirmed" && !item.removable),
    hasCameraExif,
    hasPrivacyMetadata: hasCameraExif,
    hasCopyright,
    hasIccProfile,
    payloadHash: await payloadHash(input.bytes, format),
    rewriteSafe: containerRewriteSafe &&
      !findings.some((item) => item.category === "c2pa" && item.level === "confirmed" && !item.removable),
    warnings,
    c2paInspectionStatus: c2pa?.status,
  };
}
