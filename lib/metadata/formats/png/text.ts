import { unzlibSync } from "fflate";
import { MetadataError } from "../../errors";
import { containsConfirmedAiXmp } from "../../xmp";

const MAX_TEXT_BYTES = 4 * 1024 * 1024;
const EXPLICIT_KEYS = new Set([
  "parameters",
  "prompt",
  "negative_prompt",
  "negative-prompt",
  "workflow",
  "comfyui",
  "model",
  "seed",
  "sampler",
  "steps",
  "lora",
]);

export interface ParsedPngText {
  key: string;
  value: string;
  isConfirmedAi: boolean;
  isXmp: boolean;
}

function nullIndex(bytes: Uint8Array, from = 0): number {
  for (let index = from; index < bytes.length; index += 1) {
    if (bytes[index] === 0) return index;
  }
  return -1;
}

function decode(bytes: Uint8Array): string {
  if (bytes.length > MAX_TEXT_BYTES) {
    throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG text exceeds the safe processing limit.");
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function inflate(bytes: Uint8Array): Uint8Array {
  if (bytes.length > MAX_TEXT_BYTES) {
    throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "Compressed PNG text exceeds the safe processing limit.");
  }
  try {
    const output = unzlibSync(bytes, { out: new Uint8Array(MAX_TEXT_BYTES + 1) });
    if (output.length > MAX_TEXT_BYTES) {
      throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "Inflated PNG text exceeds the safe processing limit.");
    }
    return output;
  } catch (error) {
    if (error instanceof MetadataError) throw error;
    throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG compressed text is invalid.");
  }
}

export function parsePngText(type: string, data: Uint8Array): ParsedPngText {
  const keyEnd = nullIndex(data);
  if (keyEnd <= 0 || keyEnd > 79) {
    throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG text keyword is invalid.");
  }
  const key = decode(data.subarray(0, keyEnd));
  let valueBytes: Uint8Array;
  if (type === "tEXt") {
    valueBytes = data.subarray(keyEnd + 1);
  } else if (type === "zTXt") {
    if (keyEnd + 2 > data.length || data[keyEnd + 1] !== 0) {
      throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG zTXt compression method is invalid.");
    }
    valueBytes = inflate(data.subarray(keyEnd + 2));
  } else if (type === "iTXt") {
    if (keyEnd + 3 > data.length) {
      throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG iTXt header is truncated.");
    }
    const compressed = data[keyEnd + 1];
    const method = data[keyEnd + 2];
    if ((compressed !== 0 && compressed !== 1) || method !== 0) {
      throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG iTXt compression fields are invalid.");
    }
    const languageEnd = nullIndex(data, keyEnd + 3);
    const translatedEnd = languageEnd < 0 ? -1 : nullIndex(data, languageEnd + 1);
    if (languageEnd < 0 || translatedEnd < 0) {
      throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "PNG iTXt language fields are truncated.");
    }
    const encoded = data.subarray(translatedEnd + 1);
    valueBytes = compressed === 1 ? inflate(encoded) : encoded;
  } else {
    throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "Unsupported PNG text chunk.");
  }
  const value = decode(valueBytes);
  const normalizedKey = key.trim().toLowerCase();
  const isXmp = normalizedKey.includes("xmp") || normalizedKey === "xml:com.adobe.xmp";
  return {
    key,
    value,
    isXmp,
    isConfirmedAi: EXPLICIT_KEYS.has(normalizedKey) || (isXmp && containsConfirmedAiXmp(value)),
  };
}
