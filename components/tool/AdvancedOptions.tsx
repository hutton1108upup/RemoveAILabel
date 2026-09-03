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
            <h3>Recommended AI Label Clean</h3>
            <label>
              <input
                type="checkbox"
                checked={options.removeEmbeddedC2pa}
                onChange={(event) => setOption("removeEmbeddedC2pa", event.target.checked)}
              />
              Remove embedded C2PA credentials
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.removeConfirmedAiXmp}
                onChange={(event) => setOption("removeConfirmedAiXmp", event.target.checked)}
              />
              Remove confirmed AI-related XMP packets
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.removePromptWorkflowFields}
                onChange={(event) => setOption("removePromptWorkflowFields", event.target.checked)}
              />
              Remove prompt and workflow text fields
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveCameraExif}
                disabled
                onChange={(event) => setOption("preserveCameraExif", event.target.checked)}
              />
              Preserve camera EXIF
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveCopyrightWhenSeparable}
                disabled
                onChange={(event) => setOption("preserveCopyrightWhenSeparable", event.target.checked)}
              />
              Preserve creator and copyright when separable
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveIccProfile}
                disabled
                onChange={(event) => setOption("preserveIccProfile", event.target.checked)}
              />
              Preserve ICC color profile
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.preserveOrientation}
                disabled
                onChange={(event) => setOption("preserveOrientation", event.target.checked)}
              />
              Preserve orientation
            </label>
            <p className="body-copy">
              These preservation rules are enforced by the safe cleanup engine and cannot be changed here.
            </p>
          </div>
          <div>
            <h3>Privacy Clean</h3>
            <label>
              <input
                type="checkbox"
                checked={options.removeExifPrivacyData}
                onChange={(event) => setOption("removeExifPrivacyData", event.target.checked)}
              />
              Remove EXIF, GPS, device, and date metadata
            </label>
          </div>
          <button type="button" className="button button-secondary" onClick={onRegenerate}>
            Regenerate Clean Copy
          </button>
        </div>
      ) : null}
    </div>
  );
}
