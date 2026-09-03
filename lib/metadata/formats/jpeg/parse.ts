import {
  asciiAt,
  concatBytes,
  equalBytes,
  readAscii,
  readBe16,
  readBe32,
} from "../../bytes";
import { MetadataError } from "../../errors";
import { readExifOrientation } from "../../exif";
import { containsConfirmedAiXmp, extendedXmpGuid } from "../../xmp";

const XMP_HEADER = "http://ns.adobe.com/xap/1.0/\0";
const EXTENDED_XMP_HEADER = "http://ns.adobe.com/xmp/extension/\0";
const C2PA_UUID = Uint8Array.of(
  0x63, 0x32, 0x70, 0x61, 0x00, 0x11, 0x00, 0x10,
  0x80, 0x00, 0x00, 0xaa, 0x00, 0x38, 0x9b, 0x71,
);
const MAX_SEGMENTS = 65_536;
const MAX_METADATA_BYTES = 16 * 1024 * 1024;
const MAX_EXTENDED_XMP_BYTES = 4 * 1024 * 1024;

export type JpegSegmentKind =
  | "exif"
  | "xmp"
  | "extended-xmp"
  | "icc"
  | "app11-candidate"
  | "app11-other"
  | "app13"
  | "sof"
  | "other";

export interface JpegSegment {
  marker: number;
  start: number;
  end: number;
  dataStart: number;
  dataEnd: number;
  kind: JpegSegmentKind;
  xmpAi?: boolean;
  extendedGuid?: string;
  c2paInstance?: number;
  c2paSequence?: number;
  extendedTotalLength?: number;
  extendedOffset?: number;
  extendedDataStart?: number;
}

export interface JpegC2paGroup {
  segmentIndexes: number[];
  instance: number;
}

export interface JpegExtendedXmpGroup {
  guid: string;
  segmentIndexes: number[];
  complete: boolean;
  ai: boolean;
}

export interface ParsedJpeg {
  segments: JpegSegment[];
  c2paGroups: JpegC2paGroup[];
  hasAmbiguousC2paRanges: boolean;
  extendedXmpGroups: JpegExtendedXmpGroup[];
  hasUnsafeExtendedXmp: boolean;
  payloadStart: number;
  width?: number;
  height?: number;
  orientation: number | null;
  progressive: boolean;
}

function classifySegment(bytes: Uint8Array, segment: JpegSegment): void {
  const { marker, dataStart, dataEnd } = segment;
  const payload = bytes.subarray(dataStart, dataEnd);
  if (marker === 0xe1 && asciiAt(bytes, dataStart, "Exif\0\0")) {
    segment.kind = "exif";
    return;
  }
  if (marker === 0xe1 && asciiAt(bytes, dataStart, XMP_HEADER)) {
    segment.kind = "xmp";
    const xml = new TextDecoder("utf-8", { fatal: false }).decode(payload.subarray(XMP_HEADER.length));
    segment.xmpAi = containsConfirmedAiXmp(xml);
    segment.extendedGuid = extendedXmpGuid(xml);
    return;
  }
  if (marker === 0xe1 && asciiAt(bytes, dataStart, EXTENDED_XMP_HEADER)) {
    segment.kind = "extended-xmp";
    const guidOffset = dataStart + EXTENDED_XMP_HEADER.length;
    if (guidOffset + 40 <= dataEnd) {
      segment.extendedGuid = readAscii(bytes, guidOffset, 32).toUpperCase();
      segment.extendedTotalLength = readBe32(bytes, guidOffset + 32);
      segment.extendedOffset = readBe32(bytes, guidOffset + 36);
      segment.extendedDataStart = guidOffset + 40;
    }
    return;
  }
  if (marker === 0xe2 && asciiAt(bytes, dataStart, "ICC_PROFILE\0")) {
    segment.kind = "icc";
    return;
  }
  if (marker === 0xeb) {
    if (payload.length >= 8 && asciiAt(payload, 0, "JP")) {
      segment.kind = "app11-candidate";
      segment.c2paInstance = readBe16(payload, 2);
      segment.c2paSequence = readBe32(payload, 4);
    } else {
      segment.kind = "app11-other";
    }
    return;
  }
  if (marker === 0xed) {
    segment.kind = "app13";
    return;
  }
  if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
    segment.kind = "sof";
  }
}

function collectExtendedXmpGroups(
  bytes: Uint8Array,
  segments: JpegSegment[],
): { groups: JpegExtendedXmpGroup[]; unsafe: boolean } {
  const byGuid = new Map<string, number[]>();
  segments.forEach((segment, index) => {
    if (segment.kind !== "extended-xmp" || !segment.extendedGuid) return;
    const indexes = byGuid.get(segment.extendedGuid) ?? [];
    indexes.push(index);
    byGuid.set(segment.extendedGuid, indexes);
  });
  const groups: JpegExtendedXmpGroup[] = [];
  for (const [guid, segmentIndexes] of byGuid) {
    const sorted = [...segmentIndexes].sort(
      (a, b) => (segments[a].extendedOffset ?? -1) - (segments[b].extendedOffset ?? -1),
    );
    const firstTotal = segments[sorted[0]].extendedTotalLength;
    let complete = firstTotal !== undefined && firstTotal > 0 && firstTotal <= MAX_EXTENDED_XMP_BYTES;
    let cursor = 0;
    const parts: Uint8Array[] = [];
    for (const index of sorted) {
      const segment = segments[index];
      const dataStart = segment.extendedDataStart;
      const offset = segment.extendedOffset;
      if (
        dataStart === undefined ||
        offset === undefined ||
        segment.extendedTotalLength !== firstTotal ||
        offset !== cursor ||
        dataStart > segment.dataEnd
      ) {
        complete = false;
      }
      if (dataStart !== undefined && dataStart <= segment.dataEnd) {
        const part = bytes.subarray(dataStart, segment.dataEnd);
        parts.push(part);
        cursor = offset === undefined ? cursor : offset + part.length;
        if (firstTotal !== undefined && cursor > firstTotal) complete = false;
      }
    }
    if (cursor !== firstTotal) complete = false;
    const reconstructed = concatBytes(...parts);
    groups.push({
      guid,
      segmentIndexes,
      complete,
      ai: containsConfirmedAiXmp(new TextDecoder("utf-8", { fatal: false }).decode(reconstructed)),
    });
  }
  const referencedGuids = new Set(
    segments
      .filter((segment) => segment.kind === "xmp" && segment.extendedGuid)
      .map((segment) => segment.extendedGuid as string),
  );
  const unsafe = [...referencedGuids].some((guid) => {
    const group = groups.find((candidate) => candidate.guid === guid);
    return !group?.complete;
  });
  return { groups, unsafe };
}

function isC2paJumbf(bytes: Uint8Array): boolean {
  if (bytes.length < 8 || readBe32(bytes, 0) !== bytes.length || !asciiAt(bytes, 4, "jumb")) {
    return false;
  }
  let offset = 8;
  let iterations = 0;
  while (offset < bytes.length) {
    if (++iterations > 4096 || offset + 8 > bytes.length) return false;
    const length = readBe32(bytes, offset);
    if (length < 8 || offset + length > bytes.length) return false;
    if (
      asciiAt(bytes, offset + 4, "jumd") &&
      length >= 24 &&
      equalBytes(bytes.subarray(offset + 8, offset + 24), C2PA_UUID)
    ) {
      return true;
    }
    offset += length;
  }
  return false;
}

function collectC2paGroups(bytes: Uint8Array, segments: JpegSegment[]): {
  groups: JpegC2paGroup[];
  ambiguous: boolean;
} {
  const groups: JpegC2paGroup[] = [];
  let ambiguous = false;
  let index = 0;
  while (index < segments.length) {
    const first = segments[index];
    if (first.kind !== "app11-candidate") {
      index += 1;
      continue;
    }
    const indexes: number[] = [];
    const parts: Uint8Array[] = [];
    let boxHeader: Uint8Array | undefined;
    const instance = first.c2paInstance ?? -1;
    let expectedSequence = 1;
    while (index < segments.length) {
      const segment = segments[index];
      if (
        segment.kind !== "app11-candidate" ||
        segment.c2paInstance !== instance ||
        segment.c2paSequence !== expectedSequence
      ) {
        break;
      }
      indexes.push(index);
      const fragment = bytes.subarray(segment.dataStart + 8, segment.dataEnd);
      if (expectedSequence === 1) {
        if (fragment.length >= 8) boxHeader = fragment.subarray(0, 8);
        parts.push(fragment);
      } else if (
        fragment.length >= 8 &&
        boxHeader &&
        equalBytes(fragment.subarray(0, 8), boxHeader)
      ) {
        parts.push(fragment.subarray(8));
      } else {
        parts.push(fragment);
        ambiguous = true;
      }
      expectedSequence += 1;
      index += 1;
    }
    if (indexes.length > 0 && isC2paJumbf(concatBytes(...parts))) {
      groups.push({ segmentIndexes: indexes, instance });
    } else {
      ambiguous = true;
      if (indexes.length === 0) index += 1;
    }
  }
  return { groups, ambiguous };
}

export function parseJpeg(bytes: Uint8Array): ParsedJpeg {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new MetadataError("INVALID_MAGIC_BYTES", "JPEG SOI marker is missing.");
  }
  const segments: JpegSegment[] = [];
  let offset = 2;
  let payloadStart = -1;
  let width: number | undefined;
  let height: number | undefined;
  let progressive = false;
  let metadataBytes = 0;
  for (let count = 0; count < MAX_SEGMENTS && offset < bytes.length; count += 1) {
    if (bytes[offset] !== 0xff) {
      throw new MetadataError("TRUNCATED_CONTAINER", "Expected a JPEG marker before scan data.");
    }
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) {
      throw new MetadataError("TRUNCATED_CONTAINER", "JPEG marker is truncated.");
    }
    const markerStart = offset - 1;
    const marker = bytes[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (marker === 0xd9) {
      throw new MetadataError("TRUNCATED_CONTAINER", "JPEG contains no scan data.");
    }
    if (offset + 2 > bytes.length) {
      throw new MetadataError("TRUNCATED_CONTAINER", "JPEG segment length is truncated.");
    }
    const declaredLength = readBe16(bytes, offset);
    if (declaredLength < 2) {
      throw new MetadataError("INVALID_SEGMENT_LENGTH", "JPEG segment length must include its length field.");
    }
    const dataStart = offset + 2;
    const dataEnd = offset + declaredLength;
    if (dataEnd > bytes.length) {
      throw new MetadataError("INVALID_SEGMENT_LENGTH", "JPEG segment exceeds the file boundary.");
    }
    if (marker === 0xda) {
      payloadStart = dataEnd;
      break;
    }
    const segment: JpegSegment = {
      marker,
      start: markerStart,
      end: dataEnd,
      dataStart,
      dataEnd,
      kind: "other",
    };
    classifySegment(bytes, segment);
    if (marker >= 0xe0 && marker <= 0xef) {
      metadataBytes += dataEnd - dataStart;
      if (metadataBytes > MAX_METADATA_BYTES) {
        throw new MetadataError("SAFE_REWRITE_NOT_SUPPORTED", "JPEG metadata exceeds the safe processing limit.");
      }
    }
    if (segment.kind === "sof") {
      if (dataEnd - dataStart < 6) {
        throw new MetadataError("INVALID_SEGMENT_LENGTH", "JPEG SOF segment is truncated.");
      }
      height = readBe16(bytes, dataStart + 1);
      width = readBe16(bytes, dataStart + 3);
      progressive ||= marker === 0xc2;
    }
    segments.push(segment);
    offset = dataEnd;
  }
  if (payloadStart < 0) {
    throw new MetadataError("TRUNCATED_CONTAINER", "JPEG SOS marker was not found within the segment limit.");
  }
  if (bytes.length < payloadStart + 2 || bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) {
    throw new MetadataError("TRUNCATED_CONTAINER", "JPEG EOI marker is missing.");
  }
  const { groups, ambiguous } = collectC2paGroups(bytes, segments);
  const extendedXmp = collectExtendedXmpGroups(bytes, segments);
  const orientations = segments
    .filter((segment) => segment.kind === "exif")
    .map((segment) => readExifOrientation(bytes.subarray(segment.dataStart, segment.dataEnd)));
  const validOrientations = orientations.filter((value): value is number => value !== null);
  const orientation = orientations.length > 0 &&
    validOrientations.length === orientations.length &&
    validOrientations.every((value) => value === validOrientations[0])
    ? validOrientations[0]
    : null;
  return {
    segments,
    c2paGroups: groups,
    hasAmbiguousC2paRanges: ambiguous,
    extendedXmpGroups: extendedXmp.groups,
    hasUnsafeExtendedXmp: extendedXmp.unsafe,
    payloadStart,
    width,
    height,
    orientation,
    progressive,
  };
}
