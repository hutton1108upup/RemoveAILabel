interface BatchSummaryProps {
  checked: number;
  ready: number;
  alreadyClean: number;
  reviewNeeded: number;
  unsupported: number;
  failed?: number;
  busy?: boolean;
  onDownloadZip?: () => void;
}

export function BatchSummary({
  checked,
  ready,
  alreadyClean,
  reviewNeeded,
  unsupported,
  failed = 0,
  busy = false,
  onDownloadZip,
}: BatchSummaryProps) {
  const summary = [
    `${checked} ${checked === 1 ? "file" : "files"} checked`,
    ready > 0 ? `${ready} verified ${ready === 1 ? "copy" : "copies"} ready` : null,
    alreadyClean > 0 ? `${alreadyClean} already clean` : null,
    reviewNeeded > 0 ? `${reviewNeeded} review needed` : null,
    unsupported > 0 ? `${unsupported} unsupported` : null,
    failed > 0 ? `${failed} failed` : null,
  ]
    .filter((item): item is string => item !== null)
    .join(" · ");

  return (
    <section className="card batch-summary">
      <p className="batch-summary-line">{summary}</p>
      {ready > 1 && onDownloadZip ? (
        <button type="button" className="button button-primary" disabled={busy} onClick={onDownloadZip}>
          {busy ? "Preparing ZIP…" : `Download ${ready} Verified Files as ZIP`}
        </button>
      ) : null}
    </section>
  );
}
