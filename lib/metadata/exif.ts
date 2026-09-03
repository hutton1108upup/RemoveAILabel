import { readBe16, readBe32 } from "./bytes";

function readLe16(bytes: Uint8Array, offset: number): number {
  if (offset + 2 > bytes.length) return -1;
  return bytes[offset] + bytes[offset + 1] * 0x100;
}

function readLe32(bytes: Uint8Array, offset: number): number {
  if (offset + 4 > bytes.length) return -1;
  return bytes[offset] + bytes[offset + 1] * 0x100 + bytes[offset + 2] * 0x10000 + bytes[offset + 3] * 0x1000000;
}

export function readTiffOrientation(tiff: Uint8Array): number | null {
  if (tiff.length < 8) return null;
  const tiffOffset = 0;
  const little = tiff[tiffOffset] === 0x49 && tiff[tiffOffset + 1] === 0x49;
  const big = tiff[tiffOffset] === 0x4d && tiff[tiffOffset + 1] === 0x4d;
  if (!little && !big) return null;
  const u16 = little ? readLe16 : readBe16;
  const u32 = little ? readLe32 : readBe32;
  try {
    if (u16(tiff, tiffOffset + 2) !== 42) return null;
    const ifdOffset = u32(tiff, tiffOffset + 4);
    if (ifdOffset < 8 || tiffOffset + ifdOffset + 2 > tiff.length) return null;
    const ifd = tiffOffset + ifdOffset;
    const count = u16(tiff, ifd);
    if (count < 0 || count > 1024 || ifd + 2 + count * 12 + 4 > tiff.length) return null;
    for (let index = 0; index < count; index += 1) {
      const entry = ifd + 2 + index * 12;
      if (u16(tiff, entry) !== 0x0112) continue;
      if (u16(tiff, entry + 2) !== 3 || u32(tiff, entry + 4) !== 1) return null;
      const orientation = u16(tiff, entry + 8);
      return orientation >= 1 && orientation <= 8 ? orientation : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function readExifOrientation(exifPayload: Uint8Array): number | null {
  if (
    exifPayload.length < 14 ||
    exifPayload[0] !== 0x45 ||
    exifPayload[1] !== 0x78 ||
    exifPayload[2] !== 0x69 ||
    exifPayload[3] !== 0x66 ||
    exifPayload[4] !== 0 ||
    exifPayload[5] !== 0
  ) {
    return null;
  }
  return readTiffOrientation(exifPayload.subarray(6));
}

export function minimalTiffWithOrientation(orientation: number): Uint8Array {
  return Uint8Array.of(
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08,
    0x00, 0x01,
    0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01,
    0x00, orientation, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  );
}

export function minimalExifWithOrientation(orientation: number): Uint8Array {
  const tiff = minimalTiffWithOrientation(orientation);
  const output = new Uint8Array(tiff.length + 6);
  output.set(Uint8Array.of(0x45, 0x78, 0x69, 0x66, 0, 0));
  output.set(tiff, 6);
  return output;
}
