interface DownloadActionsProps {
  href?: string;
  downloadName?: string;
  onDownload?: () => void;
  onToggleVisual: () => void;
  onCheckAnother?: () => void;
}

export function DownloadActions({
  href,
  downloadName,
  onDownload,
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
      <button type="button" className="button button-secondary" onClick={onToggleVisual}>
        Still seeing visible artifacts?
      </button>
      {onCheckAnother ? (
        <button type="button" className="button button-secondary" onClick={onCheckAnother}>
          Check Another Image
        </button>
      ) : null}
    </div>
  );
}
