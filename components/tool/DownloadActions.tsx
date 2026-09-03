interface DownloadActionsProps {
  href?: string;
  downloadName?: string;
  onDownload?: () => void;
  showVisualReview?: boolean;
  onToggleVisual: () => void;
  onCheckAnother?: () => void;
}

export function DownloadActions({
  href,
  downloadName,
  onDownload,
  showVisualReview = false,
  onToggleVisual,
  onCheckAnother,
}: DownloadActionsProps) {
  return (
    <div className="button-row">
      {href && downloadName ? (
        <a
          href={href}
          download={downloadName}
          className="button button-primary"
          onClick={onDownload}
        >
          Download Cleaned Image
        </a>
      ) : null}
      {showVisualReview ? (
        <button type="button" className="button button-ghost" onClick={onToggleVisual}>
          Still seeing visible artifacts?
        </button>
      ) : null}
      {onCheckAnother ? (
        <button type="button" className="button button-secondary" onClick={onCheckAnother}>
          Check Another Image
        </button>
      ) : null}
    </div>
  );
}
