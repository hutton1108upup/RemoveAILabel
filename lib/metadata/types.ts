export type SupportedFormat = "jpeg" | "png" | "webp";

export type ProcessingStatus =
  | "queued"
  | "validating"
  | "scanning"
  | "preparing"
  | "ready"
  | "already-clean"
  | "review-needed"
  | "unsupported"
  | "failed";

export type FindingLevel = "confirmed" | "possible" | "general";

export type FindingCategory =
  | "c2pa"
  | "ai-xmp"
  | "ai-workflow"
  | "camera-exif"
  | "privacy"
  | "copyright"
  | "color-profile"
  | "unknown";

export type FindingSource =
  | "C2PA"
  | "XMP"
  | "EXIF"
  | "IPTC"
  | "PNG_TEXT"
  | "WEBP_CHUNK";

export interface MetadataFinding {
  id: string;
  category: FindingCategory;
  source: FindingSource;
  label: string;
  level: FindingLevel;
  removable: boolean;
  autoRemoveEligible: boolean;
  explanation: string;
  localValuePreview?: string;
}

export interface ScanReport {
  fileId: string;
  fileName: string;
  format: SupportedFormat;
  mimeType: string;
  bytes: number;
  width?: number;
  height?: number;
  orientation?: number | null;
  findings: MetadataFinding[];
  hasEmbeddedC2pa: boolean;
  hasConfirmedAiMetadata: boolean;
  hasPossibleAiMetadata: boolean;
  hasCameraExif: boolean;
  hasPrivacyMetadata: boolean;
  hasCopyright: boolean;
  hasIccProfile: boolean;
  payloadHash: string;
  rewriteSafe: boolean;
  warnings: string[];
  c2paInspectionStatus?: C2paInspectionStatus;
}

export interface CleanupOptions {
  removeEmbeddedC2pa: boolean;
  removeConfirmedAiXmp: boolean;
  removePromptWorkflowFields: boolean;
  removeExifPrivacyData: boolean;
  preserveCameraExif: boolean;
  preserveCopyrightWhenSeparable: boolean;
  preserveIccProfile: boolean;
  preserveOrientation: boolean;
  webpCleanEnabled?: boolean;
}

export const RECOMMENDED_CLEANUP_OPTIONS: CleanupOptions = {
  removeEmbeddedC2pa: true,
  removeConfirmedAiXmp: true,
  removePromptWorkflowFields: true,
  removeExifPrivacyData: false,
  preserveCameraExif: true,
  preserveCopyrightWhenSeparable: true,
  preserveIccProfile: true,
  preserveOrientation: true,
  webpCleanEnabled: false,
};

export interface VerificationReport {
  removedFindingIds: string[];
  remainingTargetFindingIds: string[];
  preservedCategories: FindingCategory[];
  dimensionsUnchanged: boolean;
  encodedPayloadUnchanged: boolean;
  iccPreserved: boolean | null;
  orientationPreserved: boolean | null;
  c2paAbsentAfterCleanup: boolean | null;
  verified: boolean;
  warnings: string[];
}

export type ProcessingErrorCode =
  | "UNSUPPORTED_FORMAT"
  | "FILE_TOO_LARGE"
  | "BATCH_TOO_LARGE"
  | "INVALID_MAGIC_BYTES"
  | "TRUNCATED_CONTAINER"
  | "INVALID_SEGMENT_LENGTH"
  | "C2PA_DETECTED_RANGE_UNKNOWN"
  | "SAFE_REWRITE_NOT_SUPPORTED"
  | "VERIFICATION_FAILED"
  | "OUT_OF_MEMORY"
  | "ZIP_FAILED"
  | "UNKNOWN";

export interface ProcessFileInput {
  id: string;
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
  options?: Partial<CleanupOptions>;
}

export interface ProcessFileResult {
  id: string;
  fileName: string;
  status: ProcessingStatus;
  scan?: ScanReport;
  cleanedBytes?: Uint8Array;
  cleanedFileName?: string;
  verification?: VerificationReport;
  errorCode?: ProcessingErrorCode;
  errorMessage?: string;
}

export type C2paInspectionStatus =
  | "present"
  | "absent"
  | "unavailable"
  | "invalid";

export interface C2paInspection {
  status: C2paInspectionStatus;
  generativeAi: boolean;
  warning?: string;
}

export type C2paInspector = (
  format: SupportedFormat,
  bytes: Uint8Array,
) => Promise<C2paInspection>;

export type WorkerRequest =
  | { type: "process"; requestId: string; file: ProcessFileInput }
  | { type: "process-batch"; requestId: string; files: ProcessFileInput[] }
  | {
      type: "zip";
      requestId: string;
      files: Array<Pick<ProcessFileResult, "fileName" | "cleanedFileName" | "cleanedBytes" | "status" | "verification">>;
    }
  | { type: "dispose"; requestId: string };

export type WorkerResponse =
  | { type: "progress"; requestId: string; fileId: string; status: ProcessingStatus }
  | { type: "result"; requestId: string; result: ProcessFileResult }
  | { type: "batch-result"; requestId: string; results: ProcessFileResult[] }
  | { type: "zip-result"; requestId: string; bytes: Uint8Array; fileCount: number }
  | { type: "disposed"; requestId: string }
  | { type: "error"; requestId: string; errorCode: ProcessingErrorCode; errorMessage: string };

export interface VerifiedDownload {
  fileName: string;
  bytes: Uint8Array;
  verified: true;
}
