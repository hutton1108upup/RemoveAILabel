"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { asVerifiedDownload } from "@/lib/files/download";
import {
  DESKTOP_BATCH_LIMIT,
  MAX_FILE_BYTES,
  MOBILE_BATCH_LIMIT,
} from "@/lib/files/limits";
import { trackAnalyticsEvent } from "@/lib/analytics/events";
import {
  RECOMMENDED_CLEANUP_OPTIONS,
  type CleanupOptions,
  type ProcessFileResult,
  type ProcessingStatus,
  type WorkerRequest,
  type WorkerResponse,
} from "@/lib/metadata/types";
import { BatchSummary } from "./BatchSummary";
import { FileResultCard } from "./FileResultCard";
import { ImageDropzone } from "./ImageDropzone";
import { QueueList } from "./QueueList";

interface ToolEntry {
  id: string;
  file: File | null;
  fileName: string;
  mimeType: string;
  size: number;
  status: ProcessingStatus;
  result?: ProcessFileResult;
  options: CleanupOptions;
  downloadHref?: string;
  advancedExpanded: boolean;
  visualExpanded: boolean;
  downloaded: boolean;
  requestId?: string;
}

// Keep the public flag sealed until real lossy/lossless, alpha, animation,
// ICC, EXIF/XMP, C2PA and decoded-pixel fixtures all pass the release gate.
const WEBP_CLEAN_RELEASE_GATE_PASSED = false;

function createRequestId(fileId: string) {
  return `request-${fileId}`;
}

function createSiteBHref(rawUrl: string) {
  const url = new URL(rawUrl);
  url.searchParams.set("utm_source", "remove-ai-label");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "post-clean");
  url.searchParams.set("utm_content", "verified-result");
  return url.toString();
}

function toFailedResult(id: string, fileName: string, message: string): ProcessFileResult {
  return {
    id,
    fileName,
    status: "failed",
    errorCode: "UNKNOWN",
    errorMessage: message,
  };
}

function getConcurrency() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return 3;
  }

  return window.matchMedia("(max-width: 767px)").matches ? 1 : 3;
}

async function readFileBytes(file: File) {
  if (typeof file.arrayBuffer === "function") {
    return new Uint8Array(await file.arrayBuffer());
  }

  const response = new Response(file);
  return new Uint8Array(await response.arrayBuffer());
}

function bytesToBlob(bytes: Uint8Array, type?: string) {
  return new Blob([Uint8Array.from(bytes)], type ? { type } : undefined);
}

function mergeDefaults(options?: CleanupOptions): CleanupOptions {
  return {
    ...RECOMMENDED_CLEANUP_OPTIONS,
    ...options,
    webpCleanEnabled:
      WEBP_CLEAN_RELEASE_GATE_PASSED &&
      process.env.NEXT_PUBLIC_ENABLE_WEBP_CLEAN === "true",
  };
}

function statusSummary(entries: ToolEntry[]) {
  if (entries.length === 0) return "Idle";
  return entries.map((entry) => `${entry.fileName} ${entry.status}`).join(", ");
}

function createEntry(id: string, file: File): ToolEntry {
  return {
    id,
    file,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    status: "queued",
    options: mergeDefaults(),
    advancedExpanded: false,
    visualExpanded: false,
    downloaded: false,
  };
}

export function RemoveAiLabelTool() {
  const workerRef = useRef<Worker | null>(null);
  const counterRef = useRef(0);
  const entriesRef = useRef<ToolEntry[]>([]);
  const [entries, setEntries] = useState<ToolEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);
  const [zipBusy, setZipBusy] = useState(false);
  const [sampleBusy, setSampleBusy] = useState(false);
  const [c2paNoticeVisible, setC2paNoticeVisible] = useState(false);
  const siteBUrl = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_SITE_B_URL?.trim();
    return configured ? createSiteBHref(configured) : null;
  }, []);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    if (typeof Worker === "undefined") {
      return;
    }

    const worker = new Worker(new URL("../../workers/metadata.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;
    trackAnalyticsEvent("tool_view", { page_slug: "tool" });

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;

      if (response.type === "progress") {
        setEntries((current) =>
          current.map((entry) =>
            entry.id === response.fileId ? { ...entry, status: response.status } : entry,
          ),
        );
        return;
      }

      if (response.type === "result") {
        setEntries((current) => {
          const existing = current.find((entry) => entry.id === response.result.id);
          const download = asVerifiedDownload(response.result);
          const nextHref =
            download && typeof URL.createObjectURL === "function"
              ? URL.createObjectURL(bytesToBlob(download.bytes))
              : undefined;

          const nextEntry: ToolEntry = {
            id: response.result.id,
            file: existing?.file ?? null,
            fileName: response.result.fileName,
            mimeType: existing?.mimeType ?? "image/jpeg",
            size: existing?.size ?? response.result.scan?.bytes ?? 0,
            status: response.result.status,
            result: response.result,
            options: existing?.options ?? mergeDefaults(),
            downloadHref: nextHref,
            advancedExpanded: existing?.advancedExpanded ?? false,
            visualExpanded: existing?.visualExpanded ?? false,
            downloaded: existing?.downloaded ?? false,
          };

          if (response.result.scan?.hasEmbeddedC2pa) {
            setC2paNoticeVisible(true);
          }

          if (existing?.downloadHref && existing.downloadHref !== nextHref) {
            if (typeof URL.revokeObjectURL === "function") {
              URL.revokeObjectURL(existing.downloadHref);
            }
          }

          if (existing) {
            return current.map((entry) => (entry.id === nextEntry.id ? nextEntry : entry));
          }

          return [...current, nextEntry];
        });

        if (response.result.status === "ready") {
          trackAnalyticsEvent("verification_passed", {
            format: response.result.scan?.format,
            has_c2pa: response.result.scan?.hasEmbeddedC2pa,
            result: response.result.status,
          });
        }
        return;
      }

      if (response.type === "zip-result") {
        if (typeof URL.createObjectURL !== "function") {
          setZipBusy(false);
          return;
        }

        const href = URL.createObjectURL(bytesToBlob(response.bytes, "application/zip"));
        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.download = "remove-ai-label-cleaned.zip";
        anchor.click();
        if (typeof URL.revokeObjectURL === "function") {
          URL.revokeObjectURL(href);
        }
        setZipBusy(false);
        trackAnalyticsEvent("download_zip", { result: String(response.fileCount) });
        return;
      }

      if (response.type === "error") {
        setBatchMessage(response.errorMessage);
        setZipBusy(false);
      }
    };

    return () => {
      worker.postMessage({ type: "dispose", requestId: "dispose-tool" } satisfies WorkerRequest);
      worker.terminate();
      workerRef.current = null;
      if (typeof URL.revokeObjectURL === "function") {
        entriesRef.current.forEach((entry) => {
          if (entry.downloadHref) {
            URL.revokeObjectURL(entry.downloadHref);
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    const worker = workerRef.current;
    if (!worker) {
      return;
    }

    const activeCount = entries.filter((entry) =>
      entry.status === "validating" || entry.status === "scanning" || entry.status === "preparing",
    ).length;
    const openSlots = Math.max(getConcurrency() - activeCount, 0);
    if (openSlots === 0) {
      return;
    }

    const queuedEntries = entries.filter((entry) => entry.status === "queued" && entry.file).slice(0, openSlots);
    if (queuedEntries.length === 0) {
      return;
    }

    queuedEntries.forEach(async (entry) => {
      setEntries((current) =>
        current.map((item) => (item.id === entry.id ? { ...item, status: "validating" } : item)),
      );
      try {
        const bytes = await readFileBytes(entry.file!);
        const requestId = createRequestId(entry.id);

        setEntries((current) =>
          current.map((item) =>
            item.id === entry.id ? { ...item, requestId, status: "scanning" } : item,
          ),
        );

        trackAnalyticsEvent("scan_started", { result: "scanning" });
        worker.postMessage(
          {
            type: "process",
            requestId,
            file: {
              id: entry.id,
              fileName: entry.fileName,
              mimeType: entry.mimeType,
              bytes,
              options: entry.options,
            },
          } satisfies WorkerRequest,
          [bytes.buffer],
        );
      } catch {
        setEntries((current) =>
          current.map((item) =>
            item.id === entry.id
              ? {
                  ...item,
                  status: "failed",
                  result: {
                    id: item.id,
                    fileName: item.fileName,
                    status: "failed",
                    errorCode: "UNKNOWN",
                    errorMessage: "The file could not be read locally. Your original file is unchanged.",
                  },
                }
              : item,
          ),
        );
      }
    });
  }, [entries]);

  function enqueueFiles(inputFiles: FileList | File[]) {
    const files = Array.from(inputFiles);
    if (files.length === 0) {
      return;
    }

    const limit = getConcurrency() === 1 ? MOBILE_BATCH_LIMIT : DESKTOP_BATCH_LIMIT;
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    const tooLargeFile = files.find((file) => file.size > MAX_FILE_BYTES);
    if (tooLargeFile) {
      setBatchMessage("Each file must be 25 MB or smaller.");
      return;
    }
    if (files.length > limit.files || totalBytes > limit.bytes) {
      setBatchMessage("This batch is too large for reliable browser processing. Split it into smaller batches.");
      return;
    }

    const nextEntries = files.map((file) => {
      counterRef.current += 1;
      return createEntry(`file-${counterRef.current}`, file);
    });

    setBatchMessage(null);
    setEntries((current) => [...current, ...nextEntries]);
    trackAnalyticsEvent("files_selected", {
      file_count_bucket:
        files.length === 1
          ? "1"
          : files.length <= 5
            ? "2-5"
            : files.length <= 10
              ? "6-10"
              : "11-30",
    });
  }

  async function trySampleImage() {
    if (sampleBusy) {
      return;
    }

    setSampleBusy(true);
    setBatchMessage(null);
    try {
      const response = await fetch("/samples/adobe-20220124-CA.jpg", { cache: "force-cache" });
      if (!response.ok) {
        throw new Error("Sample image request failed");
      }

      const blob = await response.blob();
      enqueueFiles([new File([blob], "sample-adobe-export.jpg", { type: blob.type || "image/jpeg" })]);
    } catch {
      setBatchMessage("The sample image could not be loaded locally. Choose an image file instead.");
    } finally {
      setSampleBusy(false);
    }
  }

  function updateOptions(entryId: string, options: CleanupOptions) {
    setEntries((current) =>
      current.map((entry) => (entry.id === entryId ? { ...entry, options } : entry)),
    );
  }

  function regenerate(entryId: string) {
    const entry = entries.find((item) => item.id === entryId);
    const worker = workerRef.current;
    if (!entry?.file || !worker) {
      return;
    }

    setEntries((current) =>
      current.map((item) =>
        item.id === entryId
          ? {
              ...item,
              status: "validating",
              result: undefined,
              downloaded: false,
            }
          : item,
      ),
    );

    readFileBytes(entry.file)
      .then((bytes) => {
        const requestId = createRequestId(entryId);
        setEntries((current) =>
          current.map((item) =>
            item.id === entryId ? { ...item, requestId, status: "scanning" } : item,
          ),
        );
        worker.postMessage(
          {
            type: "process",
            requestId,
            file: {
              id: entryId,
              fileName: entry.fileName,
              mimeType: entry.mimeType,
              bytes,
              options: entry.options,
            },
          } satisfies WorkerRequest,
          [bytes.buffer],
        );
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "The file could not be read locally.";
        setEntries((current) =>
          current.map((item) =>
            item.id === entryId
              ? {
                  ...item,
                  status: "failed",
                  result: toFailedResult(item.id, item.fileName, message),
                }
              : item,
          ),
        );
      });
  }

  function downloadZip() {
    const worker = workerRef.current;
    if (!worker) {
      return;
    }

    const readyFiles = entries
      .map((entry) => entry.result)
      .filter((result): result is ProcessFileResult => result !== undefined)
      .filter((result) => asVerifiedDownload(result) !== undefined);

    if (readyFiles.length < 2) {
      return;
    }

    setZipBusy(true);
    worker.postMessage({
      type: "zip",
      requestId: "zip-request",
      files: readyFiles.map((result) => ({
        fileName: result.fileName,
        cleanedFileName: result.cleanedFileName,
        cleanedBytes: result.cleanedBytes,
        status: result.status,
        verification: result.verification,
      })),
    } satisfies WorkerRequest);
  }

  const queueEntries = entries.map((entry) => ({
    id: entry.id,
    fileName: entry.fileName,
    bytes: entry.size,
    status: entry.status,
  }));

  const results = entries.filter((entry) => entry.result);
  const checked = entries.filter((entry) =>
    ["ready", "already-clean", "review-needed", "unsupported", "failed"].includes(entry.status),
  ).length;
  const ready = entries.filter((entry) => entry.status === "ready" && entry.downloadHref).length;
  const alreadyClean = entries.filter((entry) => entry.status === "already-clean").length;
  const reviewNeeded = entries.filter((entry) => entry.status === "review-needed").length;
  const unsupported = entries.filter((entry) => entry.status === "unsupported").length;

  return (
    <section className="tool-shell" aria-label="Remove AI label tool">
      <div data-testid="tool-status-live" aria-live="polite" className="visually-hidden">
        {statusSummary(entries)}
      </div>
      <ImageDropzone
        dragging={dragging}
        onSelect={enqueueFiles}
        onPasteFiles={enqueueFiles}
        onTrySample={trySampleImage}
        sampleBusy={sampleBusy}
        onDragChange={setDragging}
      />
      {batchMessage ? (
        <div className="error-banner">
          <AlertTriangle size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{batchMessage}</span>
        </div>
      ) : null}
      {c2paNoticeVisible ? (
        <div className="warning-banner">
          This file contains an embedded Content Credential. If cleanup succeeds, the downloaded
          copy will not carry it. Keep the original master file.
        </div>
      ) : null}
      <QueueList entries={queueEntries} />
      {entries.length > 1 && checked > 0 ? (
        <BatchSummary
          checked={checked}
          ready={ready}
          alreadyClean={alreadyClean}
          reviewNeeded={reviewNeeded}
          unsupported={unsupported}
          onDownloadZip={downloadZip}
        />
      ) : null}
      <div className="result-list">
        {results.map((entry) => {
          const result = entry.result!;
          const showSiteB =
            Boolean(siteBUrl) &&
            ((result.status === "ready" && entry.downloaded) || result.status === "already-clean");

          return (
            <FileResultCard
              key={entry.id}
              result={result}
              downloadHref={entry.downloadHref}
              downloadName={result.cleanedFileName}
              showSiteB={showSiteB}
              siteBUrl={siteBUrl ?? undefined}
              visualExpanded={entry.visualExpanded}
              advancedExpanded={entry.advancedExpanded}
              options={entry.options}
              onDownload={() => {
                setEntries((current) =>
                  current.map((item) =>
                    item.id === entry.id ? { ...item, downloaded: true } : item,
                  ),
                );
                trackAnalyticsEvent("download_single", { format: result.scan?.format });
              }}
              onToggleVisual={() =>
                setEntries((current) =>
                  current.map((item) =>
                    item.id === entry.id
                      ? { ...item, visualExpanded: !item.visualExpanded }
                      : item,
                  ),
                )
              }
              onToggleAdvanced={() =>
                setEntries((current) =>
                  current.map((item) =>
                    item.id === entry.id
                      ? { ...item, advancedExpanded: !item.advancedExpanded }
                      : item,
                  ),
                )
              }
              onOptionsChange={(options) => updateOptions(entry.id, options)}
              onRegenerate={() => regenerate(entry.id)}
              onCheckAnother={() =>
                setEntries((current) => {
                  const target = current.find((item) => item.id === entry.id);
                  if (target?.downloadHref && typeof URL.revokeObjectURL === "function") {
                    URL.revokeObjectURL(target.downloadHref);
                  }
                  return current.filter((item) => item.id !== entry.id);
                })
              }
            />
          );
        })}
      </div>
      {zipBusy ? <p className="mono-copy">Preparing ZIP…</p> : null}
    </section>
  );
}
