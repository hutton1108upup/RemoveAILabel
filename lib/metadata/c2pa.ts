import type { C2paSdk } from "@contentauth/c2pa-web";
import { mimeTypeForFormat } from "../files/magic-bytes";
import type { C2paInspection, C2paInspector, SupportedFormat } from "./types";

let sdkPromise: Promise<C2paSdk> | undefined;

async function loadSdk(): Promise<C2paSdk> {
  if (!sdkPromise) {
    sdkPromise = import("@contentauth/c2pa-web").then(async ({ createC2pa }) => {
      const origin = globalThis.location?.origin;
      if (!origin) throw new Error("C2PA SDK requires a browser or worker origin.");
      const workerUrl = new URL("/wasm/c2pa_worker.js", origin);
      return createC2pa({
        wasmSrc: "/wasm/c2pa_bg.wasm",
        // c2pa-web intentionally rejects a configured non-HTTPS worker URL.
        // Local review therefore uses the SDK's bundled Blob worker; production
        // HTTPS builds use the separately hosted worker for CSP compatibility.
        ...(workerUrl.protocol === "https:" ? { workerSrc: workerUrl } : {}),
      });
    });
  }
  return sdkPromise;
}

function hasGenerativeSignal(value: unknown): boolean {
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    return false;
  }
  return /generative|trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia|c2pa\.ai_/i.test(serialized);
}

export const inspectC2pa: C2paInspector = async (
  format: SupportedFormat,
  bytes: Uint8Array,
): Promise<C2paInspection> => {
  let sdk: C2paSdk;
  try {
    sdk = await loadSdk();
  } catch {
    return {
      status: "unavailable",
      generativeAi: false,
      warning: "The official C2PA reader could not be initialized.",
    };
  }
  let reader: Awaited<ReturnType<C2paSdk["reader"]["fromBlob"]>>;
  try {
    const copy = bytes.slice();
    reader = await sdk.reader.fromBlob(
      mimeTypeForFormat(format),
      new Blob([copy.buffer], { type: mimeTypeForFormat(format) }),
    );
  } catch {
    return {
      status: "invalid",
      generativeAi: false,
      warning: "The official C2PA reader could not validate the embedded data.",
    };
  }
  if (!reader) return { status: "absent", generativeAi: false };
  try {
    const store = await reader.manifestStore();
    return { status: "present", generativeAi: hasGenerativeSignal(store) };
  } catch {
    return {
      status: "invalid",
      generativeAi: false,
      warning: "The embedded C2PA manifest could not be read safely.",
    };
  } finally {
    await reader.free();
  }
};

export async function disposeC2pa(): Promise<void> {
  const current = sdkPromise;
  sdkPromise = undefined;
  if (!current) return;
  try {
    (await current).dispose();
  } catch {
    // Initialization may already have failed; there is no SDK resource to release.
  }
}
