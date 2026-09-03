"use client";

import { useId, useRef } from "react";
import { Upload } from "lucide-react";

interface ImageDropzoneProps {
  dragging: boolean;
  onSelect: (files: FileList | File[]) => void;
  onPasteFiles: (files: File[]) => void;
  onTrySample: () => void;
  sampleBusy?: boolean;
  onDragChange: (dragging: boolean) => void;
}

export function ImageDropzone({
  dragging,
  onSelect,
  onPasteFiles,
  onTrySample,
  sampleBusy = false,
  onDragChange,
}: ImageDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`card tool-dropzone${dragging ? " is-dragging" : ""}`}
      aria-label="Image file dropzone"
      onClick={openFilePicker}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFilePicker();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        onDragChange(true);
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        onDragChange(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        onDragChange(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDragChange(false);
        onSelect(Array.from(event.dataTransfer.files));
      }}
      onPaste={(event) => {
        const files = Array.from(event.clipboardData.items)
          .filter((item) => item.kind === "file")
          .map((item) => item.getAsFile())
          .filter((file): file is File => file !== null);
        if (files.length > 0) {
          onPasteFiles(files);
        }
      }}
    >
      <Upload size={48} strokeWidth={1.5} color="var(--Colors-accent)" aria-hidden="true" />
      <p className="body-large">Drop, paste, or choose image files</p>
      <p className="mono-copy">JPG & PNG · WebP inspection only · Up to 25 MB each · No image upload</p>
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
        onChange={(event) => {
          if (event.target.files) {
            onSelect(event.target.files);
            event.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
