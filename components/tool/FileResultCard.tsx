import type { CleanupOptions, ProcessFileResult } from "@/lib/metadata/types";
import { AlertTriangle, CheckCircle2, CircleX } from "lucide-react";
import { DownloadActions } from "./DownloadActions";
import { AdvancedOptions } from "./AdvancedOptions";
import { SiteBUpsell } from "./SiteBUpsell";
import { ResultComparison } from "./ResultComparison";

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
        <article className="card result-card result-card-ready">
          <div className="result-header">
            <div className="result-title-group">
              <p className="result-status-line">
                <CheckCircle2 size={20} strokeWidth={1.75} aria-hidden="true" />
                Done — clean copy verified
              </p>
              <h3>{result.cleanedFileName ?? result.fileName}</h3>
              <p className="body-copy">
                Supported fields were removed from a separate copy. The original file was not changed.
              </p>
            </div>
            <span className="status-chip status-chip-ready">File-level clean copy ready</span>
          </div>
          <DownloadActions
            href={downloadHref}
            downloadName={downloadName}
            onDownload={onDownload}
            showVisualReview={Boolean(siteBUrl)}
            onToggleVisual={onToggleVisual}
            onCheckAnother={onCheckAnother}
          />
          <ResultComparison result={result} />
          <p className="body-copy result-note">
            This verifies the cleaned file only. A platform may still use other signals or disclosure rules.
          </p>
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
        <article className="card result-card result-card-state">
          <div className="result-header">
            <div className="result-title-group">
              <h3>No supported AI-label metadata found</h3>
              <p className="result-file-name">{result.fileName}</p>
            </div>
            <span className="status-chip status-chip-already-clean">Original unchanged</span>
          </div>
          <p>No clean copy was created because there was no supported target to remove.</p>
          <p className="body-copy result-note">
            This result describes the selected file only. A platform may still use other signals or disclosure rules.
          </p>
          <div className="button-row">
            <button type="button" className="button button-secondary" onClick={onCheckAnother}>
              Check Another Image
            </button>
          </div>
        </article>
        {showSiteB && siteBUrl ? <SiteBUpsell href={siteBUrl} variant="already-clean" /> : null}
      </>
    );
  }

  if (result.status === "review-needed") {
    return (
      <article className="card result-card result-card-state">
        <div className="result-header">
          <div className="result-title-group">
            <h3>Review needed — no clean copy created</h3>
            <p className="result-file-name">{result.fileName}</p>
          </div>
          <span className="status-chip status-chip-review-needed">Review needed</span>
        </div>
        <div className="warning-banner warning-banner-inline">
          <AlertTriangle size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{result.errorMessage ?? "Metadata may be related to an AI signal, but this file cannot be cleaned safely. No clean copy was created."}</span>
        </div>
        <p className="body-copy result-note">Your original file remains unchanged.</p>
        <div className="button-row">
          <button type="button" className="button button-secondary" onClick={onCheckAnother}>
            Check Another Image
          </button>
        </div>
      </article>
    );
  }

  if (result.status === "unsupported") {
    return (
      <article className="card result-card result-card-state">
        <div className="result-header">
          <div className="result-title-group">
            <h3>This file is not supported for cleanup</h3>
            <p className="result-file-name">{result.fileName}</p>
          </div>
          <span className="status-chip status-chip-unsupported">Unsupported</span>
        </div>
        <div className="error-banner">
          <CircleX size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{result.errorMessage ?? "Use a JPG or PNG for verified cleanup. WebP remains inspection-only in this version."}</span>
        </div>
        <div className="button-row">
          <button type="button" className="button button-secondary" onClick={onCheckAnother}>
            Choose Another Image
          </button>
        </div>
      </article>
    );
  }

  if (result.status === "failed") {
    return (
      <article className="card result-card result-card-state">
        <div className="result-header">
          <div className="result-title-group">
            <h3>Processing failed — original unchanged</h3>
            <p className="result-file-name">{result.fileName}</p>
          </div>
          <span className="status-chip status-chip-failed">Failed</span>
        </div>
        <div className="error-banner">
          <CircleX size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{result.errorMessage ?? "The file could not be processed locally."}</span>
        </div>
        <div className="button-row">
          <button type="button" className="button button-secondary" onClick={onCheckAnother}>
            Choose Another Image
          </button>
        </div>
      </article>
    );
  }

  return null;
}
