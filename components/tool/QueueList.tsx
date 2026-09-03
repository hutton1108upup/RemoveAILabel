import type { ProcessingStatus } from "@/lib/metadata/types";

interface QueueListEntry {
  id: string;
  fileName: string;
  bytes: number;
  status: ProcessingStatus;
}

interface QueueListProps {
  entries: QueueListEntry[];
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(bytes / 1024, 0.1).toFixed(1)} KB`;
}

function statusLabel(status: ProcessingStatus) {
  if (status === "queued") return "Waiting";
  if (status === "validating") return "Reading file";
  if (status === "scanning") return "Scanning metadata";
  if (status === "preparing") return "Preparing copy";
  if (status === "review-needed") return "Review needed";
  if (status === "already-clean") return "Already clean";
  if (status === "ready") return "File-level clean copy ready";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function QueueList({ entries }: QueueListProps) {
  if (entries.length === 0) {
    return null;
  }

  const checkedCount = entries.filter((entry) =>
    ["ready", "already-clean", "review-needed", "unsupported", "failed"].includes(entry.status),
  ).length;
  const allChecked = checkedCount === entries.length;
  const fileLabel = entries.length === 1 ? "file" : "files";

  if (allChecked) {
    return (
      <details className="card queue-shell queue-shell-complete">
        <summary className="queue-summary">
          <span>{`Checked ${checkedCount} ${fileLabel}`}</span>
          <span className="file-meta">View file details</span>
        </summary>
        <div className="queue-complete-list">
          {entries.map((entry) => (
            <div key={entry.id} className="queue-item">
              <strong>{entry.fileName}</strong>
              <span className="file-meta">{formatBytes(entry.bytes)}</span>
              <span className={`status-chip status-chip-${entry.status}`}>{statusLabel(entry.status)}</span>
            </div>
          ))}
        </div>
      </details>
    );
  }

  return (
    <section className="card queue-shell">
      <p>{`Checking ${checkedCount} of ${entries.length} ${fileLabel}…`}</p>
      {entries.map((entry) => (
        <div key={entry.id} className="queue-item">
          <strong>{entry.fileName}</strong>
          <span className="file-meta">{formatBytes(entry.bytes)}</span>
          <span className={`status-chip status-chip-${entry.status}`}>{statusLabel(entry.status)}</span>
          {entry.status === "validating" || entry.status === "scanning" || entry.status === "preparing" ? (
            <div className="progress-bar" aria-hidden="true" />
          ) : null}
        </div>
      ))}
    </section>
  );
}
