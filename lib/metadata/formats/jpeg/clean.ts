import { concatBytes, writeBe16 } from "../../bytes";
import { MetadataError } from "../../errors";
import { minimalExifWithOrientation } from "../../exif";
import { parseJpeg } from "./parse";

export interface JpegCleanOptions {
  removeC2pa: boolean;
  removeAiXmp: boolean;
  privacyClean: boolean;
  c2paConfirmed: boolean;
}

function jpegSegment(marker: number, payload: Uint8Array): Uint8Array {
  return concatBytes(Uint8Array.of(0xff, marker), writeBe16(payload.length + 2), payload);
}

export function cleanJpeg(bytes: Uint8Array, options: JpegCleanOptions): Uint8Array {
  const parsed = parseJpeg(bytes);
  if (options.removeC2pa && options.c2paConfirmed && parsed.c2paGroups.length === 0) {
    throw new MetadataError(
      "C2PA_DETECTED_RANGE_UNKNOWN",
      "C2PA was confirmed but no complete removable JPEG APP11 group was found.",
    );
  }
  if (options.removeC2pa && options.c2paConfirmed && parsed.hasAmbiguousC2paRanges) {
    throw new MetadataError(
      "C2PA_DETECTED_RANGE_UNKNOWN",
      "A C2PA-like JPEG APP11 fragment range is incomplete or ambiguous.",
    );
  }
  if (options.removeAiXmp && parsed.hasUnsafeExtendedXmp) {
    throw new MetadataError(
      "SAFE_REWRITE_NOT_SUPPORTED",
      "Associated Extended XMP fragments are incomplete, overlapping, or inconsistent.",
    );
  }
  const removedIndexes = new Set<number>();
  if (options.removeC2pa && options.c2paConfirmed) {
    for (const group of parsed.c2paGroups) {
      for (const index of group.segmentIndexes) removedIndexes.add(index);
    }
  }
  const aiExtendedGuids = new Set<string>(
    parsed.segments
      .filter((segment) => segment.kind === "xmp" && segment.xmpAi && segment.extendedGuid)
      .map((segment) => segment.extendedGuid as string),
  );
  const referencedExtendedGuids = new Set(
    parsed.segments
      .filter((segment) => segment.kind === "xmp" && segment.extendedGuid)
      .map((segment) => segment.extendedGuid as string),
  );
  for (const group of parsed.extendedXmpGroups) {
    if (group.complete && group.ai && referencedExtendedGuids.has(group.guid)) {
      aiExtendedGuids.add(group.guid);
    }
  }
  if (options.removeAiXmp) {
    parsed.segments.forEach((segment, index) => {
      if (
        segment.kind === "xmp" &&
        (segment.xmpAi || Boolean(segment.extendedGuid && aiExtendedGuids.has(segment.extendedGuid)))
      ) {
        removedIndexes.add(index);
      }
      if (
        segment.kind === "extended-xmp" &&
        segment.extendedGuid &&
        aiExtendedGuids.has(segment.extendedGuid)
      ) {
        removedIndexes.add(index);
      }
    });
  }
  let replacementExif: Uint8Array | undefined;
  if (options.privacyClean) {
    const exifIndexes = parsed.segments
      .map((segment, index) => (segment.kind === "exif" ? index : -1))
      .filter((index) => index >= 0);
    if (exifIndexes.length > 0) {
      if (parsed.orientation === null) {
        throw new MetadataError(
          "SAFE_REWRITE_NOT_SUPPORTED",
          "EXIF orientation could not be determined safely for privacy cleaning.",
        );
      }
      replacementExif = jpegSegment(0xe1, minimalExifWithOrientation(parsed.orientation));
      exifIndexes.forEach((index) => removedIndexes.add(index));
    }
  }
  const parts: Uint8Array[] = [];
  let replacementInserted = false;
  let cursor = 0;
  parsed.segments.forEach((segment, index) => {
    if (!removedIndexes.has(index)) return;
    parts.push(bytes.subarray(cursor, segment.start));
    if (
      options.privacyClean && replacementExif && !replacementInserted && segment.kind === "exif"
    ) {
      parts.push(replacementExif);
      replacementInserted = true;
    }
    cursor = segment.end;
  });
  parts.push(bytes.subarray(cursor));
  return concatBytes(...parts);
}
