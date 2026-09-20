"use client";

import { useId, useRef } from "react";
import type { ClipboardEvent, DragEvent, KeyboardEvent } from "react";
import { Upload } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";

interface ImageDropzoneProps {
  dragging: boolean;
  onSelect: (files: FileList | File[]) => void;
  onPasteFiles: (files: File[]) => void;
  onTrySample: () => void;
  sampleBusy?: boolean;
  onDragChange: (dragging: boolean) => void;
  variant?: "full" | "compact";
  inputId?: string;
}

export function ImageDropzone({
  dragging,
  onSelect,
  onPasteFiles,
  onTrySample,
  sampleBusy = false,
  onDragChange,
  variant = "full",
  inputId: providedInputId,
}: ImageDropzoneProps) {
  const generatedInputId = useId();
  const inputId = providedInputId ?? generatedInputId;
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    inputRef.current?.click();
  }

  const sharedInput = (
    <>
      <label htmlFor={inputId} className="hidden-input">
        Choose image files
      </label>
      <input
        id={inputId}
        ref={inputRef}
        className="hidden-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        aria-label="Choose image files"
        onClick={() => trackAnalyticsEvent("file_picker_opened")}
        onChange={(event) => {
          if (event.target.files) {
            onSelect(event.target.files);
            event.currentTarget.value = "";
          }
        }}
      />
    </>
  );

  const dropzoneHandlers = {
    onClick: openFilePicker,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFilePicker();
      }
    },
    onDragOver: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      onDragChange(true);
    },
    onDragEnter: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      onDragChange(true);
    },
    onDragLeave: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      onDragChange(false);
    },
    onDrop: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      onDragChange(false);
      onSelect(Array.from(event.dataTransfer.files));
    },
    onPaste: (event: ClipboardEvent<HTMLDivElement>) => {
      const files = Array.from(event.clipboardData.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);
      if (files.length > 0) {
        onPasteFiles(files);
      }
    },
  };

  if (variant === "compact") {
    return (
      <div
        role="button"
        tabIndex={0}
        className={`card tool-dropzone tool-dropzone-compact${dragging ? " is-dragging" : ""}`}
        aria-label="Add more image files"
        {...dropzoneHandlers}
      >
        <Upload size={24} strokeWidth={1.5} color="var(--Colors-accent)" aria-hidden="true" />
        <div className="tool-dropzone-copy">
          <strong>Add more images</strong>
          <span className="file-meta">JPG, PNG, or WebP · processed locally</span>
        </div>
        <span className="button button-secondary compact-dropzone-action" aria-hidden="true">
          Choose files
        </span>
        {sharedInput}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`card tool-dropzone${dragging ? " is-dragging" : ""}`}
      aria-label="Image file dropzone"
      {...dropzoneHandlers}
    >
      <Upload size={48} strokeWidth={1.5} color="var(--Colors-accent)" aria-hidden="true" />
      <p className="body-large">Drop, paste, or choose image files</p>
      <p className="mono-copy">JPG & PNG · WebP inspection only · Up to 25 MB each · No image upload</p>
      <p className="mobile-format-note">iPhone photo in HEIC? Save or export it as JPG first.</p>
      <button
        type="button"
        className="button button-secondary"
        onClick={(event) => {
          event.stopPropagation();
          openFilePicker();
        }}
      >
        Choose images
      </button>
      <p className="sample-prompt">
        <span>No file handy? </span>
        <button
          type="button"
          className="sample-link"
          aria-label="Try a sample image"
          disabled={sampleBusy}
          onClick={(event) => {
            event.stopPropagation();
            onTrySample();
          }}
        >
          {sampleBusy ? "Loading sample…" : "Try a sample image"}
        </button>
      </p>
      {sharedInput}
    </div>
  );
}
