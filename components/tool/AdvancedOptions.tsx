"use client";

import type { CleanupOptions } from "@/lib/metadata/types";

interface AdvancedOptionsProps {
  options: CleanupOptions;
  expanded: boolean;
  onToggle: () => void;
  onChange: (options: CleanupOptions) => void;
  onRegenerate: () => void;
}

export function AdvancedOptions({
  options,
  expanded,
  onToggle,
  onChange,
  onRegenerate,
}: AdvancedOptionsProps) {
  function setOption<K extends keyof CleanupOptions>(key: K, value: CleanupOptions[K]) {
    if (key === "removeExifPrivacyData" && value === true) {
      onChange({
        ...options,
        removeExifPrivacyData: true,
        preserveCameraExif: false,
      });
      return;
    }

    if (key === "preserveCameraExif" && value === true) {
      onChange({
        ...options,
        preserveCameraExif: true,
        removeExifPrivacyData: false,
      });
      return;
    }

    onChange({ ...options, [key]: value });
  }

  return (
    <div className="card">
      <button
        type="button"
        className="button button-secondary"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        Advanced Options
      </button>
      {expanded ? (
        <div className="route-stack">
          <div>
            <h3>Recommended cleanup</h3>
            <label>
              <input
                type="checkbox"
                checked={options.removeEmbeddedC2pa}
                onChange={(event) => setOption("removeEmbeddedC2pa", event.target.checked)}
              />
              Remove embedded Content Credentials (C2PA)
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.removeConfirmedAiXmp}
                onChange={(event) => setOption("removeConfirmedAiXmp", event.target.checked)}
              />
              Remove confirmed AI-related XMP
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.removePromptWorkflowFields}
                onChange={(event) => setOption("removePromptWorkflowFields", event.target.checked)}
              />
              Remove prompt and workflow fields
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveCameraExif}
                disabled
                onChange={(event) => setOption("preserveCameraExif", event.target.checked)}
              />
              Keep camera EXIF
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveCopyrightWhenSeparable}
                disabled
                onChange={(event) => setOption("preserveCopyrightWhenSeparable", event.target.checked)}
              />
              Keep creator and copyright when possible
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveIccProfile}
                disabled
                onChange={(event) => setOption("preserveIccProfile", event.target.checked)}
              />
              Keep ICC color profile
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveOrientation}
                disabled
                onChange={(event) => setOption("preserveOrientation", event.target.checked)}
              />
              Keep image orientation
            </label>
            <p className="body-copy">
              These preservation choices protect the image and cannot be changed here.
            </p>
          </div>
          <div>
            <h3>Privacy cleanup</h3>
            <label>
              <input
                type="checkbox"
                checked={options.removeExifPrivacyData}
                onChange={(event) => setOption("removeExifPrivacyData", event.target.checked)}
              />
              Remove GPS, device, date, and other EXIF details
            </label>
            <p className="body-copy">
              This can also remove camera details and some copyright data. Your original stays unchanged.
            </p>
          </div>
          <button type="button" className="button button-secondary" onClick={onRegenerate}>
            Create New Clean Copy
          </button>
        </div>
      ) : null}
    </div>
  );
}
