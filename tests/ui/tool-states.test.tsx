import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildJpeg, buildPng, buildWebp } from "@/tests/fixtures/builders";
import { RECOMMENDED_CLEANUP_OPTIONS, type WorkerResponse } from "@/lib/metadata/types";
import { RemoveAiLabelTool } from "@/components/tool/RemoveAiLabelTool";

class FakeWorker {
  static instances: FakeWorker[] = [];

  onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readonly messages: unknown[] = [];
  readonly transfers: unknown[][] = [];
  terminated = false;

  constructor() {
    FakeWorker.instances.push(this);
  }

  postMessage(message: unknown, transfer?: unknown[]) {
    this.messages.push(message);
    this.transfers.push(transfer ?? []);
  }

  terminate() {
    this.terminated = true;
  }

  emit(response: WorkerResponse) {
    this.onmessage?.({ data: response } as MessageEvent<WorkerResponse>);
  }
}

function installWorker() {
  FakeWorker.instances = [];
  Object.defineProperty(window, "Worker", {
    configurable: true,
    writable: true,
    value: FakeWorker,
  });
  Object.defineProperty(globalThis, "Worker", {
    configurable: true,
    writable: true,
    value: FakeWorker,
  });
}

function createReadyResponse(fileId: string, verified = true): WorkerResponse {
  return {
    type: "result",
    requestId: `request-${fileId}`,
    result: {
      id: fileId,
      fileName: "photo.jpg",
      status: "ready",
      cleanedFileName: "photo-clean.jpg",
      cleanedBytes: Uint8Array.of(1, 2, 3),
      scan: {
        fileId,
        fileName: "photo.jpg",
        format: "jpeg",
        mimeType: "image/jpeg",
        bytes: 3,
        findings: [],
        hasEmbeddedC2pa: true,
        hasConfirmedAiMetadata: true,
        hasPossibleAiMetadata: false,
        hasCameraExif: true,
        hasPrivacyMetadata: false,
        hasCopyright: true,
        hasIccProfile: true,
        payloadHash: "abc",
        rewriteSafe: true,
        warnings: [],
      },
      verification: {
        removedFindingIds: [],
        remainingTargetFindingIds: [],
        preservedCategories: ["camera-exif", "copyright", "color-profile"],
        dimensionsUnchanged: true,
        encodedPayloadUnchanged: true,
        iccPreserved: true,
        orientationPreserved: true,
        c2paAbsentAfterCleanup: true,
        verified,
        warnings: [],
      },
    },
  };
}

function blobPart(bytes: Uint8Array) {
  return Uint8Array.from(bytes);
}

describe("remove-ai-label tool behavior", () => {
  const originalCreateObjectUrl = URL.createObjectURL;
  const originalRevokeObjectUrl = URL.revokeObjectURL;

  beforeEach(() => {
    installWorker();
    vi.restoreAllMocks();
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
    URL.createObjectURL = vi.fn(() => "blob:verified-download");
    URL.revokeObjectURL = vi.fn();
    delete process.env.NEXT_PUBLIC_SITE_B_URL;
    delete process.env.NEXT_PUBLIC_ENABLE_WEBP_CLEAN;
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectUrl;
    URL.revokeObjectURL = originalRevokeObjectUrl;
  });

  it("shows real queue states, never shows Uploading, and only creates download blobs for verified ready results", async () => {
    const user = userEvent.setup();
    const file = new File([blobPart(buildJpeg())], "photo.jpg", { type: "image/jpeg" });
    render(<RemoveAiLabelTool />);

    const input = screen.getByLabelText("Choose image files");
    await user.upload(input, file);

    const worker = FakeWorker.instances.at(0);
    expect(worker).toBeTruthy();
    expect(screen.queryByText("Uploading")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Validating") ?? screen.getByText("Scanning"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(worker?.messages).toHaveLength(1);
    });

    const request = worker?.messages.at(0) as {
      file: { id: string; options: typeof RECOMMENDED_CLEANUP_OPTIONS };
      type: string;
    };
    expect(request.type).toBe("process");
    expect(request.file.options).toMatchObject(RECOMMENDED_CLEANUP_OPTIONS);
    const fileId = request.file.id;
    expect(worker?.transfers.at(0)).toHaveLength(1);
    expect(screen.getByText("Scanning")).toBeInTheDocument();
    expect(screen.queryByText("Checking 1 of 1 files…")).not.toBeInTheDocument();
    expect(screen.getByText("Checking 0 of 1 files…")).toBeInTheDocument();

    worker?.emit({ type: "progress", requestId: `request-${fileId}`, fileId, status: "scanning" });
    expect(await screen.findAllByText("Scanning")).toHaveLength(1);

    worker?.emit(createReadyResponse(fileId, false));
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "Download Cleaned Image" })).not.toBeInTheDocument();
    });
    expect(URL.createObjectURL).not.toHaveBeenCalled();

    worker?.emit(createReadyResponse(fileId, true));
    expect(await screen.findByRole("link", { name: "Download Cleaned Image" })).toBeInTheDocument();
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
  });

  it("keeps WebP cleaning sealed in this build even when the public flag is set", async () => {
    process.env.NEXT_PUBLIC_ENABLE_WEBP_CLEAN = "true";
    const user = userEvent.setup();
    const file = new File([blobPart(buildWebp())], "beta.webp", { type: "image/webp" });
    render(<RemoveAiLabelTool />);

    await user.upload(screen.getByLabelText("Choose image files"), file);
    const worker = FakeWorker.instances.at(0);
    await waitFor(() => expect(worker?.messages).toHaveLength(1));
    const request = worker?.messages.at(0) as {
      file: { options: { webpCleanEnabled?: boolean } };
    };

    expect(request.file.options.webpCleanEnabled).toBe(false);
  });

  it("keeps Site B hidden without a configured URL, even after a verified download", async () => {
    const user = userEvent.setup();
    const file = new File([blobPart(buildPng())], "photo.png", { type: "image/png" });
    render(<RemoveAiLabelTool />);

    await user.upload(screen.getByLabelText("Choose image files"), file);
    const worker = FakeWorker.instances.at(0);
    worker?.emit(createReadyResponse("a", true));

    const downloadLink = await screen.findByRole("link", { name: "Download Cleaned Image" });
    downloadLink.addEventListener("click", (event) => event.preventDefault());
    await user.click(downloadLink);
    expect(screen.queryByRole("link", { name: "Make the Image Look More Natural" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Check Visible AI Artifacts" })).not.toBeInTheDocument();
    expect(
      screen.queryByText("File metadata is clean. This does not change visible skin, lighting, hands, textures or other image artifacts."),
    ).not.toBeInTheDocument();
  });

  it("shows Site B only after download or already-clean states when NEXT_PUBLIC_SITE_B_URL is configured", async () => {
    process.env.NEXT_PUBLIC_SITE_B_URL = "https://site-b.example.com";
    const user = userEvent.setup();
    const file = new File([blobPart(buildPng())], "photo.png", { type: "image/png" });
    render(<RemoveAiLabelTool />);

    await user.upload(screen.getByLabelText("Choose image files"), file);
    const worker = FakeWorker.instances.at(0);
    worker?.emit(createReadyResponse("a", true));

    expect(screen.queryByRole("link", { name: "Make the Image Look More Natural" })).not.toBeInTheDocument();

    const downloadLink = await screen.findByRole("link", { name: "Download Cleaned Image" });
    downloadLink.addEventListener("click", (event) => event.preventDefault());
    await user.click(downloadLink);
    expect(await screen.findByRole("link", { name: "Make the Image Look More Natural" })).toHaveAttribute(
      "href",
      expect.stringContaining("utm_source=remove-ai-label"),
    );

    worker?.emit({
      type: "result",
      requestId: "request-b",
      result: {
        id: "b",
        fileName: "clean.png",
        status: "already-clean",
        scan: {
          fileId: "b",
          fileName: "clean.png",
          format: "png",
          mimeType: "image/png",
          bytes: 3,
          findings: [],
          hasEmbeddedC2pa: false,
          hasConfirmedAiMetadata: false,
          hasPossibleAiMetadata: false,
          hasCameraExif: false,
          hasPrivacyMetadata: false,
          hasCopyright: false,
          hasIccProfile: false,
          payloadHash: "clean",
          rewriteSafe: true,
          warnings: [],
        },
      },
    });

    expect(await screen.findByRole("link", { name: "Check Visible AI Artifacts" })).toBeInTheDocument();
  });

  it("locks preservation checkboxes and only leaves supported cleanup controls editable", async () => {
    const user = userEvent.setup();
    const file = new File([blobPart(buildJpeg())], "photo.jpg", { type: "image/jpeg" });
    render(<RemoveAiLabelTool />);

    await user.upload(screen.getByLabelText("Choose image files"), file);
    const worker = FakeWorker.instances.at(0);
    await waitFor(() => {
      const first = worker?.messages.at(0) as { file?: { id: string } } | undefined;
      expect(first?.file?.id).toBeTruthy();
    });
    const fileId = (worker?.messages.at(0) as { file: { id: string } }).file.id;
    worker?.emit(createReadyResponse(fileId, true));

    await user.click(await screen.findByRole("button", { name: "Advanced Options" }));

    expect(screen.getByLabelText("Remove embedded C2PA credentials")).toBeEnabled();
    expect(screen.getByLabelText("Remove confirmed AI-related XMP packets")).toBeEnabled();
    expect(screen.getByLabelText("Remove prompt and workflow text fields")).toBeEnabled();
    expect(screen.getByLabelText("Remove EXIF, GPS, device, and date metadata")).toBeEnabled();

    expect(screen.getByLabelText("Preserve camera EXIF")).toBeDisabled();
    expect(screen.getByLabelText("Preserve creator and copyright when separable")).toBeDisabled();
    expect(screen.getByLabelText("Preserve ICC color profile")).toBeDisabled();
    expect(screen.getByLabelText("Preserve orientation")).toBeDisabled();
    expect(
      screen.getByText("These preservation rules are enforced by the safe cleanup engine and cannot be changed here."),
    ).toBeInTheDocument();
  });

  it("revokes an existing download URL when Check Another Image removes a ready result", async () => {
    const user = userEvent.setup();
    const file = new File([blobPart(buildJpeg())], "photo.jpg", { type: "image/jpeg" });
    render(<RemoveAiLabelTool />);

    await user.upload(screen.getByLabelText("Choose image files"), file);
    const worker = FakeWorker.instances.at(0);
    await waitFor(() => {
      expect(worker?.messages).toHaveLength(1);
    });
    const fileId = (worker?.messages.at(0) as { file: { id: string } }).file.id;
    worker?.emit(createReadyResponse(fileId, true));

    await user.click(await screen.findByRole("button", { name: "Check Another Image" }));

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:verified-download");
    expect(screen.queryByRole("link", { name: "Download Cleaned Image" })).not.toBeInTheDocument();
  });

  it("supports drag-drop and clipboard paste with local file bytes only", async () => {
    render(<RemoveAiLabelTool />);
    const dropzone = screen.getByRole("button", { name: "Drop images here, paste from your clipboard, or choose files" });
    expect(dropzone).not.toHaveClass("is-dragging");

    fireEvent.dragEnter(dropzone, {
      dataTransfer: { files: [], items: [], types: ["Files"] },
    });
    expect(dropzone).toHaveClass("is-dragging");

    fireEvent.dragLeave(dropzone);
    expect(dropzone).not.toHaveClass("is-dragging");

    const droppedFile = new File([blobPart(buildJpeg())], "drop.jpg", { type: "image/jpeg" });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [droppedFile], items: [], types: ["Files"] },
    });
    expect(dropzone).not.toHaveClass("is-dragging");
    await waitFor(() => {
      expect(FakeWorker.instances.at(0)?.messages).toHaveLength(1);
    });

    const pastedFile = new File([blobPart(buildPng())], "paste.png", { type: "image/png" });
    fireEvent.paste(dropzone, {
      clipboardData: {
        files: [pastedFile],
        items: [{ kind: "file", type: "image/png", getAsFile: () => pastedFile }],
      },
    });
    await waitFor(() => {
      expect(FakeWorker.instances.at(0)?.messages).toHaveLength(2);
    });
  });

  it("marks a file failed when local file reading throws and continues the rest of the batch", async () => {
    const user = userEvent.setup();
    const brokenFile = new File([blobPart(buildJpeg())], "broken.jpg", { type: "image/jpeg" });
    Object.defineProperty(brokenFile, "arrayBuffer", {
      configurable: true,
      value: vi.fn().mockRejectedValue(new Error("read failed")),
    });
    const goodFile = new File([blobPart(buildPng())], "good.png", { type: "image/png" });
    render(<RemoveAiLabelTool />);

    await user.upload(screen.getByLabelText("Choose image files"), [brokenFile, goodFile]);

    await waitFor(() => {
      expect(screen.getByText(/Failed\./)).toBeInTheDocument();
      expect(FakeWorker.instances.at(0)?.messages).toHaveLength(1);
    });
  });

  it("surfaces regenerate read failures as failed results with the original error message", async () => {
    const user = userEvent.setup();
    const file = new File([blobPart(buildJpeg())], "photo.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "arrayBuffer", {
      configurable: true,
      value: vi
        .fn()
        .mockResolvedValueOnce(blobPart(buildJpeg()).buffer)
        .mockRejectedValueOnce(new Error("regenerate read failed")),
    });
    render(<RemoveAiLabelTool />);

    await user.upload(screen.getByLabelText("Choose image files"), file);
    const worker = FakeWorker.instances.at(0);
    await waitFor(() => {
      expect(worker?.messages).toHaveLength(1);
    });
    const fileId = (worker?.messages.at(0) as { file: { id: string } }).file.id;
    worker?.emit(createReadyResponse(fileId, true));

    await user.click(await screen.findByRole("button", { name: "Advanced Options" }));
    await user.click(screen.getByRole("button", { name: "Regenerate Clean Copy" }));

    expect(await screen.findByText("Failed. regenerate read failed")).toBeInTheDocument();
  });
});
