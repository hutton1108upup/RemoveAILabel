import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerificationTable } from "@/components/tool/VerificationTable";
import type { ProcessFileResult } from "@/lib/metadata/types";

function buildResult(): ProcessFileResult {
  return {
    id: "demo",
    fileName: "demo.png",
    status: "ready",
    cleanedFileName: "demo-clean.png",
    cleanedBytes: Uint8Array.of(1, 2),
    scan: {
      fileId: "demo",
      fileName: "demo.png",
      format: "png",
      mimeType: "image/png",
      bytes: 2,
      findings: [
        {
          id: "camera",
          category: "camera-exif",
          source: "EXIF",
          label: "Camera EXIF",
          level: "general",
          removable: false,
          autoRemoveEligible: false,
          explanation: "camera",
        },
      ],
      hasEmbeddedC2pa: false,
      hasConfirmedAiMetadata: true,
      hasPossibleAiMetadata: false,
      hasCameraExif: true,
      hasPrivacyMetadata: false,
      hasCopyright: false,
      hasIccProfile: true,
      payloadHash: "demo",
      rewriteSafe: true,
      warnings: [],
    },
    verification: {
      removedFindingIds: [],
      remainingTargetFindingIds: [],
      preservedCategories: ["camera-exif", "color-profile"],
      dimensionsUnchanged: true,
      encodedPayloadUnchanged: true,
      iccPreserved: true,
      orientationPreserved: true,
      c2paAbsentAfterCleanup: null,
      verified: true,
      warnings: [],
    },
  };
}

describe("verification table", () => {
  it("only marks AI XMP and workflow rows removed when those findings were actually present before cleanup", () => {
    render(<VerificationTable result={buildResult()} />);

    const aiRow = screen.getByText("AI-related XMP").closest(".table-row") as HTMLElement | null;
    const workflowRow = screen.getByText("Prompt / workflow").closest(".table-row") as HTMLElement | null;
    if (!aiRow || !workflowRow) {
      throw new Error("expected rows");
    }

    expect(within(aiRow).getAllByText("Not found")).toHaveLength(2);
    expect(within(workflowRow).getAllByText("Not found")).toHaveLength(2);
    expect(screen.getByText("Camera EXIF").closest(".table-row")).toHaveTextContent("Preserved");
    expect(within(aiRow).getAllByText("Not found")[0].closest("td")).toHaveAttribute("data-label", "Before");
    expect(within(aiRow).getAllByText("Not found")[1].closest("td")).toHaveAttribute(
      "data-label",
      "Clean copy",
    );
  });
});
