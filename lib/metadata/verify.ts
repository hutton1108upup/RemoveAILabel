import type { ScanReport, VerificationReport } from "./types";

function targetIds(report: ScanReport): string[] {
  return report.findings
    .filter((finding) => finding.level === "confirmed" && finding.autoRemoveEligible)
    .map((finding) => finding.id);
}

export function verifyReports(before: ScanReport, after: ScanReport): VerificationReport {
  const remainingTargetFindingIds = targetIds(after);
  const beforeTargets = targetIds(before);
  const encodedPayloadUnchanged = before.payloadHash === after.payloadHash;
  const dimensionsUnchanged = before.width === after.width && before.height === after.height;
  const iccPreserved = before.hasIccProfile ? after.hasIccProfile : null;
  const orientationPreserved = before.orientation == null
    ? null
    : before.orientation === after.orientation;
  const c2paAbsentAfterCleanup = before.hasEmbeddedC2pa
    ? after.c2paInspectionStatus === "absent" && !after.hasEmbeddedC2pa
    : null;
  const warnings = [...after.warnings];
  if (!encodedPayloadUnchanged) warnings.push("Encoded image payload changed.");
  if (!dimensionsUnchanged) warnings.push("Image dimensions changed.");
  if (iccPreserved === false) warnings.push("ICC color profile was not preserved.");
  if (orientationPreserved === false) warnings.push("EXIF orientation was not preserved.");
  if (before.hasEmbeddedC2pa && c2paAbsentAfterCleanup !== true) {
    warnings.push("The official C2PA reader did not confirm that credentials are absent.");
  }
  if (remainingTargetFindingIds.length > 0) warnings.push("Target metadata remains after cleanup.");
  return {
    removedFindingIds: beforeTargets.filter((id) => !remainingTargetFindingIds.includes(id)),
    remainingTargetFindingIds,
    preservedCategories: [...new Set(after.findings.filter((item) => item.level === "general").map((item) => item.category))],
    dimensionsUnchanged,
    encodedPayloadUnchanged,
    iccPreserved,
    orientationPreserved,
    c2paAbsentAfterCleanup,
    verified:
      remainingTargetFindingIds.length === 0 &&
      encodedPayloadUnchanged &&
      dimensionsUnchanged &&
      iccPreserved !== false &&
      orientationPreserved !== false &&
      (!before.hasEmbeddedC2pa || c2paAbsentAfterCleanup === true),
    warnings,
  };
}
