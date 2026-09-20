import type { ProcessFileResult } from "@/lib/metadata/types";
import { VerificationTable } from "./VerificationTable";

interface ResultComparisonProps {
  result: ProcessFileResult;
}

function beforeSummary(result: ProcessFileResult) {
  const found: string[] = [];

  if (result.scan?.hasEmbeddedC2pa) {
    found.push("Embedded C2PA");
  }
  if (result.scan?.findings.some((finding) => finding.category === "ai-xmp")) {
    found.push("AI-related XMP");
  }
  if (result.scan?.findings.some((finding) => finding.category === "ai-workflow")) {
    found.push("Prompt / workflow data");
  }

  return found.length > 0 ? `${found.join(" · ")} found` : "Supported metadata found";
}

function cleanCopySummary(result: ProcessFileResult) {
  const changes: string[] = [];
  const removedFindingIds = new Set(result.verification?.removedFindingIds ?? []);

  if (result.scan?.hasEmbeddedC2pa && result.verification?.c2paAbsentAfterCleanup) {
    changes.push("C2PA removed");
  }
  if (
    result.scan?.findings.some(
      (finding) => finding.category === "ai-xmp" && removedFindingIds.has(finding.id),
    )
  ) {
    changes.push("AI-related XMP removed");
  }
  if (
    result.scan?.findings.some(
      (finding) => finding.category === "ai-workflow" && removedFindingIds.has(finding.id),
    )
  ) {
    changes.push("Prompt / workflow data removed");
  }
  if (changes.length === 0) {
    changes.push("Supported targets removed");
  }
  if (result.verification?.encodedPayloadUnchanged) {
    changes.push("Image payload unchanged");
  }

  return changes.join(" · ");
}

export function ResultComparison({ result }: ResultComparisonProps) {
  return (
    <div className="result-comparison-wrap">
      <p className="result-comparison-intro">What changed in the verified copy</p>
      <div className="result-comparison" aria-label="Before and clean copy summary">
        <section className="result-comparison-panel result-comparison-before">
          <p className="result-comparison-label">Before</p>
          <p>{beforeSummary(result)}</p>
        </section>
        <section className="result-comparison-panel result-comparison-clean">
          <p className="result-comparison-label">Clean copy</p>
          <p>{cleanCopySummary(result)}</p>
        </section>
      </div>
      <details className="verification-details">
        <summary>View full 7-point verification report</summary>
        <div className="verification-details-content">
          <VerificationTable result={result} />
        </div>
      </details>
    </div>
  );
}
