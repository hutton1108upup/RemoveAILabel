import type { CleanupOptions, ProcessFileResult } from "@/lib/metadata/types";
import { AlertTriangle, CircleX } from "lucide-react";
import { VerificationTable } from "./VerificationTable";
import { DownloadActions } from "./DownloadActions";
import { AdvancedOptions } from "./AdvancedOptions";
import { SiteBUpsell } from "./SiteBUpsell";

interface FileResultCardProps {
  result: ProcessFileResult;
  downloadHref?: string;
  downloadName?: string;
  showSiteB: boolean;
  siteBUrl?: string;
  visualExpanded: boolean;
  advancedExpanded: boolean;
  options: CleanupOptions;
  onDownload: () => void;
  onToggleVisual: () => void;
  onToggleAdvanced: () => void;
  onOptionsChange: (options: CleanupOptions) => void;
  onRegenerate: () => void;
  onCheckAnother: () => void;
}

export function FileResultCard({
  result,
  downloadHref,
  downloadName,
  showSiteB,
  siteBUrl,
  visualExpanded,
  advancedExpanded,
  options,
  onDownload,
  onToggleVisual,
  onToggleAdvanced,
  onOptionsChange,
  onRegenerate,
  onCheckAnother,
}: FileResultCardProps) {
  if (result.status === "ready") {
    return (
      <>
        <article className="card result-card">
          <div className="result-header">
            <h3>{result.cleanedFileName ?? result.fileName}</h3>
            <span className="status-chip status-chip-ready">File-level clean copy ready</span>
          </div>
          <VerificationTable result={result} />
          <p className="body-copy result-note">
            Supported fields were removed and verified. This result describes the file, not the platform&apos;s decision.
          </p>
          <DownloadActions
            href={downloadHref}
            downloadName={downloadName}
            onDownload={onDownload}
            onToggleVisual={onToggleVisual}
            onCheckAnother={onCheckAnother}
          />
          <AdvancedOptions
            options={options}
            expanded={advancedExpanded}
            onToggle={onToggleAdvanced}
            onChange={onOptionsChange}
            onRegenerate={onRegenerate}
          />
        </article>
        {showSiteB && siteBUrl ? <SiteBUpsell href={siteBUrl} variant="post-clean" /> : null}
        {!showSiteB && visualExpanded && siteBUrl ? <SiteBUpsell href={siteBUrl} variant="post-clean" /> : null}
      </>
    );
  }

  if (result.status === "already-clean") {
    return (
      <>
        <article className="card result-card">
          <h3>No supported AI-label fields were found in this file.</h3>
          <p>The original file was not rewritten.</p>
          <p>A platform may still use other signals or disclosure rules.</p>
          <button type="button" className="button button-secondary" onClick={onCheckAnother}>
            Check Another Image
          </button>
        </article>
        {showSiteB && siteBUrl ? <SiteBUpsell href={siteBUrl} variant="already-clean" /> : null}
      </>
    );
  }

  if (result.status === "review-needed") {
    return (
      <article className="card result-card">
        <div className="result-header">
          <h3>{result.fileName}</h3>
          <span className="status-chip status-chip-review-needed">Review needed</span>
        </div>
        <div className="warning-banner warning-banner-inline">
          <AlertTriangle size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{result.errorMessage ?? "Metadata may be related to an AI signal, but this file cannot be cleaned safely. No clean copy was created."}</span>
        </div>
      </article>
    );
  }

  if (result.status === "unsupported" || result.status === "failed") {
    return (
      <article className="error-banner">
        <CircleX size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>{`${result.status === "unsupported" ? "Unsupported file." : "Processing failed."} ${result.errorMessage ?? ""}`.trim()}</span>
      </article>
    );
  }

  return null;
}
