import { MetadataError } from "./errors";

export function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  if (!Number.isSafeInteger(length)) {
    throw new MetadataError("OUT_OF_MEMORY", "Output length exceeds a safe integer.");
  }
  const output = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

export function asciiAt(bytes: Uint8Array, offset: number, value: string): boolean {
  if (offset < 0 || offset + value.length > bytes.length) return false;
  for (let index = 0; index < value.length; index += 1) {
    if (bytes[offset + index] !== value.charCodeAt(index)) return false;
  }
  return true;
}

export function readAscii(bytes: Uint8Array, offset: number, length: number): string {
  if (offset < 0 || length < 0 || offset + length > bytes.length) {
    throw new MetadataError("TRUNCATED_CONTAINER", "ASCII field exceeds the container boundary.");
  }
  let output = "";
  for (let index = offset; index < offset + length; index += 1) {
    output += String.fromCharCode(bytes[index]);
  }
  return output;
}

export function readBe16(bytes: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 2 > bytes.length) {
    throw new MetadataError("TRUNCATED_CONTAINER", "16-bit field exceeds the container boundary.");
  }
  return bytes[offset] * 0x100 + bytes[offset + 1];
}

export function readBe32(bytes: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 4 > bytes.length) {
    throw new MetadataError("TRUNCATED_CONTAINER", "32-bit field exceeds the container boundary.");
  }
  return (
    bytes[offset] * 0x1000000 +
    bytes[offset + 1] * 0x10000 +
    bytes[offset + 2] * 0x100 +
    bytes[offset + 3]
  );
}

export function readLe32(bytes: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 4 > bytes.length) {
    throw new MetadataError("TRUNCATED_CONTAINER", "32-bit field exceeds the container boundary.");
  }
  return (
    bytes[offset] +
    bytes[offset + 1] * 0x100 +
    bytes[offset + 2] * 0x10000 +
    bytes[offset + 3] * 0x1000000
  );
}

export function writeBe16(value: number): Uint8Array {
  return Uint8Array.of((value >>> 8) & 0xff, value & 0xff);
}

export function writeBe32(value: number): Uint8Array {
  return Uint8Array.of(
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  );
}

export function writeLe32(value: number): Uint8Array {
  return Uint8Array.of(
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  );
}

export function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return false;
  }
  return true;
}
