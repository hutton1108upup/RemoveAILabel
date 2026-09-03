import type { ProcessFileResult } from "@/lib/metadata/types";

interface VerificationTableProps {
  result: ProcessFileResult;
}

function boolCell(value: boolean | null | undefined, positiveLabel: string) {
  if (value === true) {
    return <span className="cell-preserved">{positiveLabel}</span>;
  }
  if (value === false) {
    return <span className="cell-not-found">Not found</span>;
  }
  return <span className="cell-not-found">—</span>;
}

function findingIdsByCategory(result: ProcessFileResult, category: "ai-xmp" | "ai-workflow") {
  return (
    result.scan?.findings
      .filter((finding) => finding.category === category)
      .map((finding) => finding.id) ?? []
  );
}

function removalCell(result: ProcessFileResult, findingIds: string[]) {
  if (findingIds.length === 0) {
    return <span className="cell-not-found">Not found</span>;
  }

  const remaining = result.verification?.remainingTargetFindingIds ?? [];
  const removed = result.verification?.removedFindingIds ?? [];
  const anyRemaining = findingIds.some((id) => remaining.includes(id));
  if (anyRemaining) {
    return <span>Found</span>;
  }

  const anyRemoved = findingIds.some((id) => removed.includes(id));
  if (anyRemoved || result.verification?.verified) {
    return <span className="cell-removed">Removed</span>;
  }

  return <span>Found</span>;
}

export function VerificationTable({ result }: VerificationTableProps) {
  const scan = result.scan;
  const verification = result.verification;
  const aiXmpFindingIds = findingIdsByCategory(result, "ai-xmp");
  const workflowFindingIds = findingIdsByCategory(result, "ai-workflow");

  return (
    <table className="verification-table">
      <thead>
        <tr className="table-row table-head">
          <th scope="col">Item</th>
          <th scope="col">Before</th>
          <th scope="col">Clean copy</th>
        </tr>
      </thead>
      <tbody>
        <tr className="table-row">
          <td>Embedded C2PA</td>
          <td data-label="Before">{scan?.hasEmbeddedC2pa ? "Found" : "Not found"}</td>
          <td data-label="Clean copy">{verification?.c2paAbsentAfterCleanup ? <span className="cell-removed">Removed</span> : "Not found"}</td>
        </tr>
        <tr className="table-row">
          <td>AI-related XMP</td>
          <td data-label="Before">{aiXmpFindingIds.length > 0 ? "Found" : "Not found"}</td>
          <td data-label="Clean copy">{removalCell(result, aiXmpFindingIds)}</td>
        </tr>
        <tr className="table-row">
          <td>Prompt / workflow</td>
          <td data-label="Before">{workflowFindingIds.length > 0 ? "Found" : "Not found"}</td>
          <td data-label="Clean copy">{removalCell(result, workflowFindingIds)}</td>
        </tr>
        <tr className="table-row">
          <td>Camera EXIF</td>
          <td data-label="Before">{scan?.hasCameraExif ? "Found" : "Not found"}</td>
          <td data-label="Clean copy">{boolCell(verification?.preservedCategories.includes("camera-exif"), "Preserved")}</td>
        </tr>
        <tr className="table-row">
          <td>Creator / copyright</td>
          <td data-label="Before">{scan?.hasCopyright ? "Found" : "Not found"}</td>
          <td data-label="Clean copy">
            {verification?.preservedCategories.includes("copyright") ? (
              <span className="cell-preserved">
                Preserved*
                <span className="inline-note"> when separable</span>
              </span>
            ) : (
              <span className="cell-not-found">Not found</span>
            )}
          </td>
        </tr>
        <tr className="table-row">
          <td>ICC profile</td>
          <td data-label="Before">{scan?.hasIccProfile ? "Found" : "Not found"}</td>
          <td data-label="Clean copy">{boolCell(verification?.iccPreserved, "Preserved")}</td>
        </tr>
        <tr className="table-row">
          <td>Image payload</td>
          <td data-label="Before">—</td>
          <td data-label="Clean copy">{boolCell(verification?.encodedPayloadUnchanged, "Not re-encoded")}</td>
        </tr>
      </tbody>
    </table>
  );
}
