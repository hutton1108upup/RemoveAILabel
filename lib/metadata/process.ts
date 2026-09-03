import { asVerifiedDownload } from "../files/download";
import { cleanedFileName } from "../files/filename";
import { assertFileSize } from "../files/limits";
import { MetadataError, toMetadataError } from "./errors";
import { cleanJpeg } from "./formats/jpeg/clean";
import { cleanPng } from "./formats/png/clean";
import { cleanWebp } from "./formats/webp/clean";
import { scanBytes } from "./scan";
import {
  RECOMMENDED_CLEANUP_OPTIONS,
  type C2paInspector,
  type CleanupOptions,
  type ProcessFileInput,
  type ProcessFileResult,
} from "./types";
import { verifyReports } from "./verify";

export interface ProcessDependencies {
  inspectC2pa?: C2paInspector;
  inspectCleanedC2pa?: C2paInspector;
}

function mergeOptions(options?: Partial<CleanupOptions>): CleanupOptions {
  return { ...RECOMMENDED_CLEANUP_OPTIONS, ...options };
}

function cleanByFormat(
  bytes: Uint8Array,
  format: "jpeg" | "png" | "webp",
  options: CleanupOptions,
  c2paConfirmed: boolean,
): Uint8Array {
  if (format === "jpeg") {
    return cleanJpeg(bytes, {
      removeC2pa: options.removeEmbeddedC2pa,
      removeAiXmp: options.removeConfirmedAiXmp || options.removePromptWorkflowFields,
      privacyClean: options.removeExifPrivacyData,
      c2paConfirmed,
    });
  }
  if (format === "png") {
    return cleanPng(bytes, {
      removeC2pa: options.removeEmbeddedC2pa && c2paConfirmed,
      removeAiText: options.removeConfirmedAiXmp || options.removePromptWorkflowFields,
      privacyClean: options.removeExifPrivacyData,
    });
  }
  return cleanWebp(bytes, {
    removeC2pa: options.removeEmbeddedC2pa,
    removeAiXmp: options.removeConfirmedAiXmp || options.removePromptWorkflowFields,
    privacyClean: options.removeExifPrivacyData,
    enabled: options.webpCleanEnabled === true,
    c2paConfirmed,
  });
}

export async function processFile(
  input: ProcessFileInput,
  dependencies: ProcessDependencies = {},
): Promise<ProcessFileResult> {
  try {
    assertFileSize(input.bytes.byteLength);
    const options = mergeOptions(input.options);
    const before = await scanBytes(input, { inspectC2pa: dependencies.inspectC2pa });
    const confirmedTargets = before.findings.filter(
      (finding) => finding.level === "confirmed" && finding.autoRemoveEligible,
    );
    if (!before.rewriteSafe || before.hasPossibleAiMetadata) {
      const unsafeConfirmedC2pa = before.findings.some(
        (finding) => finding.category === "c2pa" && finding.level === "confirmed" && !finding.removable,
      );
      return {
        id: input.id,
        fileName: input.fileName,
        status: "review-needed",
        scan: before,
        errorCode: before.rewriteSafe
          ? undefined
          : unsafeConfirmedC2pa
            ? "C2PA_DETECTED_RANGE_UNKNOWN"
            : "SAFE_REWRITE_NOT_SUPPORTED",
        errorMessage: before.rewriteSafe
          ? undefined
          : "Metadata may be related to an AI signal, but this file cannot be cleaned safely. No clean copy was created.",
      };
    }
    if (confirmedTargets.length === 0 && !options.removeExifPrivacyData) {
      return {
        id: input.id,
        fileName: input.fileName,
        status: "already-clean",
        scan: before,
      };
    }
    if (before.format === "webp" && options.webpCleanEnabled !== true) {
      return {
        id: input.id,
        fileName: input.fileName,
        status: "review-needed",
        scan: before,
        errorCode: "SAFE_REWRITE_NOT_SUPPORTED",
        errorMessage: "WebP can be inspected but not cleaned in this version.",
      };
    }
    const cleaned = cleanByFormat(
      input.bytes,
      before.format,
      options,
      before.hasEmbeddedC2pa,
    );
    const after = await scanBytes(
      {
        id: input.id,
        fileName: input.fileName,
        mimeType: input.mimeType,
        bytes: cleaned,
      },
      {
        inspectC2pa: dependencies.inspectCleanedC2pa ?? dependencies.inspectC2pa,
        forceC2paInspection: before.hasEmbeddedC2pa,
      },
    );
    const verification = verifyReports(before, after);
    if (!verification.verified) {
      return {
        id: input.id,
        fileName: input.fileName,
        status: "failed",
        scan: before,
        verification,
        errorCode: "VERIFICATION_FAILED",
        errorMessage: "We could not verify the new copy, so it is not available for download. Your original file is unchanged.",
      };
    }
    return {
      id: input.id,
      fileName: input.fileName,
      status: "ready",
      scan: before,
      cleanedBytes: cleaned,
      cleanedFileName: cleanedFileName(input.fileName, before.format),
      verification,
    };
  } catch (error) {
    const normalized = toMetadataError(error);
    return {
      id: input.id,
      fileName: input.fileName,
      status: "failed",
      errorCode: normalized.code,
      errorMessage: normalized.message.replace(/^[A-Z2_]+:\s*/, ""),
    };
  }
}

export function canDownload(result: ProcessFileResult): boolean {
  return asVerifiedDownload(result) !== undefined;
}

export function requireDownload(result: ProcessFileResult): ReturnType<typeof asVerifiedDownload> {
  const download = asVerifiedDownload(result);
  if (!download) {
    throw new MetadataError("VERIFICATION_FAILED", "This output is not verified for download.");
  }
  return download;
}
