/// <reference lib="webworker" />

import { asVerifiedDownload } from "../lib/files/download";
import { assertBatchSize } from "../lib/files/limits";
import { createVerifiedZip } from "../lib/files/zip";
import { disposeC2pa } from "../lib/metadata/c2pa";
import { toMetadataError } from "../lib/metadata/errors";
import {
  processFile,
  type ProcessDependencies,
} from "../lib/metadata/process";
import type { WorkerRequest, WorkerResponse } from "../lib/metadata/types";

export async function handleWorkerRequest(
  request: WorkerRequest,
  dependencies: ProcessDependencies = {},
): Promise<WorkerResponse> {
  try {
    if (request.type === "process") {
      return {
        type: "result",
        requestId: request.requestId,
        result: await processFile(request.file, dependencies),
      };
    }
    if (request.type === "process-batch") {
      assertBatchSize(request.files);
      const results = [];
      for (const file of request.files) {
        results.push(await processFile(file, dependencies));
      }
      return { type: "batch-result", requestId: request.requestId, results };
    }
    if (request.type === "zip") {
      const verified = request.files.map((file) => {
        if (!file.cleanedBytes || !file.cleanedFileName) return undefined;
        return asVerifiedDownload({
          id: "zip-entry",
          fileName: file.fileName,
          status: file.status,
          cleanedBytes: file.cleanedBytes,
          cleanedFileName: file.cleanedFileName,
          verification: file.verification,
        });
      });
      const bytes = createVerifiedZip(verified);
      return {
        type: "zip-result",
        requestId: request.requestId,
        bytes,
        fileCount: verified.filter(Boolean).length,
      };
    }
    await disposeC2pa();
    return { type: "disposed", requestId: request.requestId };
  } catch (error) {
    const normalized = toMetadataError(error);
    return {
      type: "error",
      requestId: request.requestId,
      errorCode: normalized.code,
      errorMessage: normalized.message.replace(/^[A-Z2_]+:\s*/, ""),
    };
  }
}

const isDedicatedWorker =
  typeof globalThis.WorkerGlobalScope !== "undefined" &&
  globalThis instanceof globalThis.WorkerGlobalScope;

if (isDedicatedWorker) {
  globalThis.addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
    const response = await handleWorkerRequest(event.data);
    globalThis.postMessage(response);
  });
}
