/* eslint-disable @next/next/no-img-element -- These previews are local blob URLs, not network images. */

import { CheckCircle2, CircleAlert, FileImage, LoaderCircle } from "lucide-react";
import type { ProcessingStatus } from "@/lib/metadata/types";

interface QueueListEntry {
  id: string;
  fileName: string;
  bytes: number;
  status: ProcessingStatus;
  previewHref?: string;
}

interface QueueListProps {
  entries: QueueListEntry[];
  selectedId?: string;
  onSelect: (entryId: string) => void;
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

function StatusIcon({ status }: { status: ProcessingStatus }) {
  if (status === "validating" || status === "scanning" || status === "preparing") {
    return <LoaderCircle size={14} strokeWidth={1.75} className="status-icon-spinning" aria-hidden="true" />;
  }
  if (status === "ready" || status === "already-clean") {
    return <CheckCircle2 size={14} strokeWidth={1.75} aria-hidden="true" />;
  }
  if (status === "review-needed" || status === "unsupported" || status === "failed") {
    return <CircleAlert size={14} strokeWidth={1.75} aria-hidden="true" />;
  }
  return <FileImage size={14} strokeWidth={1.75} aria-hidden="true" />;
}

export function QueueList({ entries, selectedId, onSelect }: QueueListProps) {
  if (entries.length === 0) {
    return null;
  }

  const checkedCount = entries.filter((entry) =>
    ["ready", "already-clean", "review-needed", "unsupported", "failed"].includes(entry.status),
  ).length;
  const allChecked = checkedCount === entries.length;
  const fileLabel = entries.length === 1 ? "file" : "files";
  const heading = allChecked
    ? entries.length === 1
      ? "Selected file"
      : `${entries.length} files in this check`
    : `Checking ${checkedCount} of ${entries.length} ${fileLabel}…`;

  return (
    <section className="queue-shell" aria-label="Selected image files">
      <div className="queue-heading">
        <p>{heading}</p>
        <span className="file-meta">{checkedCount}/{entries.length} checked</span>
      </div>
      <div className="queue-file-list">
        {entries.map((entry) => {
          const active = entry.status === "validating" || entry.status === "scanning" || entry.status === "preparing";
          const selected = entry.id === selectedId;

          return (
            <button
              key={entry.id}
              type="button"
              className={`queue-item${selected ? " is-selected" : ""}`}
              aria-current={selected ? "true" : undefined}
              onClick={() => onSelect(entry.id)}
            >
              <span className="queue-thumbnail" aria-hidden="true">
                {entry.previewHref ? (
                  <img src={entry.previewHref} alt="" />
                ) : (
                  <FileImage size={22} strokeWidth={1.5} />
                )}
              </span>
              <span className="queue-file-copy">
                <strong title={entry.fileName}>{entry.fileName}</strong>
                <span className="file-meta">{formatBytes(entry.bytes)}</span>
                <span className={`status-chip status-chip-${entry.status}`}>
                  <StatusIcon status={entry.status} />
                  {statusLabel(entry.status)}
                </span>
                {active ? (
                  <span className="progress-bar" role="progressbar" aria-label={`${statusLabel(entry.status)} for ${entry.fileName}`} />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
