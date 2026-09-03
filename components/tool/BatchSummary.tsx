interface BatchSummaryProps {
  checked: number;
  ready: number;
  alreadyClean: number;
  reviewNeeded: number;
  unsupported: number;
  onDownloadZip?: () => void;
}

export function BatchSummary({
  checked,
  ready,
  alreadyClean,
  reviewNeeded,
  unsupported,
  onDownloadZip,
}: BatchSummaryProps) {
  return (
    <section className="card batch-summary">
      <p>{checked} files checked</p>
      <p>{ready} clean copies ready</p>
      <p>{alreadyClean} already clean</p>
      <p>{reviewNeeded} review needed</p>
      <p>{unsupported} unsupported</p>
      {ready > 1 && onDownloadZip ? (
        <button type="button" className="button button-primary" onClick={onDownloadZip}>
          Download {ready} Cleaned Files as ZIP
        </button>
      ) : null}
    </section>
  );
}
