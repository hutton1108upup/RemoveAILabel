import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RemoveAiLabelTool } from "@/components/tool/RemoveAiLabelTool";
import type { WorkerResponse } from "@/lib/metadata/types";

class AccessibleWorker {
  static instances: AccessibleWorker[] = [];

  onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null = null;
  readonly messages: unknown[] = [];

  constructor() {
    AccessibleWorker.instances.push(this);
  }

  postMessage(message: unknown) {
    this.messages.push(message);
  }

  terminate() {}

  emit(response: WorkerResponse) {
    this.onmessage?.({ data: response } as MessageEvent<WorkerResponse>);
  }
}

describe("tool accessibility", () => {
  beforeEach(() => {
    AccessibleWorker.instances = [];
    Object.defineProperty(window, "Worker", {
      configurable: true,
      writable: true,
      value: AccessibleWorker,
    });
    Object.defineProperty(globalThis, "Worker", {
      configurable: true,
      writable: true,
      value: AccessibleWorker,
    });
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
    URL.createObjectURL = vi.fn(() => "blob:test");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it("keeps the dropzone keyboard-operable and exposes an aria-live status region", async () => {
    const user = userEvent.setup();
    render(<RemoveAiLabelTool />);

    const dropzone = screen.getByRole("button", {
      name: "Drop images here, paste from your clipboard, or choose files",
    });

    dropzone.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(screen.getByLabelText("Choose image files")).toBeInTheDocument();
    expect(screen.getByTestId("tool-status-live")).toHaveAttribute("aria-live", "polite");
  });

  it("shows the C2PA warning once even if multiple results include embedded credentials", async () => {
    render(<RemoveAiLabelTool />);
    await waitFor(() => {
      expect(AccessibleWorker.instances.length).toBe(1);
    });
    const worker = AccessibleWorker.instances.at(0);

    worker?.emit({
      type: "result",
      requestId: "request-a",
      result: {
        id: "a",
        fileName: "first.jpg",
        status: "ready",
        cleanedFileName: "first-clean.jpg",
        cleanedBytes: Uint8Array.of(1),
        scan: {
          fileId: "a",
          fileName: "first.jpg",
          format: "jpeg",
          mimeType: "image/jpeg",
          bytes: 1,
          findings: [],
          hasEmbeddedC2pa: true,
          hasConfirmedAiMetadata: true,
          hasPossibleAiMetadata: false,
          hasCameraExif: true,
          hasPrivacyMetadata: false,
          hasCopyright: false,
          hasIccProfile: false,
          payloadHash: "a",
          rewriteSafe: true,
          warnings: [],
        },
        verification: {
          removedFindingIds: [],
          remainingTargetFindingIds: [],
          preservedCategories: ["camera-exif"],
          dimensionsUnchanged: true,
          encodedPayloadUnchanged: true,
          iccPreserved: true,
          orientationPreserved: true,
          c2paAbsentAfterCleanup: true,
          verified: true,
          warnings: [],
        },
      },
    });

    worker?.emit({
      type: "result",
      requestId: "request-b",
      result: {
        id: "b",
        fileName: "second.jpg",
        status: "ready",
        cleanedFileName: "second-clean.jpg",
        cleanedBytes: Uint8Array.of(2),
        scan: {
          fileId: "b",
          fileName: "second.jpg",
          format: "jpeg",
          mimeType: "image/jpeg",
          bytes: 1,
          findings: [],
          hasEmbeddedC2pa: true,
          hasConfirmedAiMetadata: true,
          hasPossibleAiMetadata: false,
          hasCameraExif: true,
          hasPrivacyMetadata: false,
          hasCopyright: false,
          hasIccProfile: false,
          payloadHash: "b",
          rewriteSafe: true,
          warnings: [],
        },
        verification: {
          removedFindingIds: [],
          remainingTargetFindingIds: [],
          preservedCategories: ["camera-exif"],
          dimensionsUnchanged: true,
          encodedPayloadUnchanged: true,
          iccPreserved: true,
          orientationPreserved: true,
          c2paAbsentAfterCleanup: true,
          verified: true,
          warnings: [],
        },
      },
    });

    expect(
      await screen.findByText(
        "Content Credentials can contain verifiable provenance and editing history. The cleaned copy will no longer carry that embedded credential. Keep your original master file.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Content Credentials can contain verifiable provenance and editing history\./),
    ).toHaveLength(1);
  });

  it("lets an already-clean result clear itself with Check Another Image", async () => {
    render(<RemoveAiLabelTool />);
    await waitFor(() => {
      expect(AccessibleWorker.instances.length).toBe(1);
    });
    const worker = AccessibleWorker.instances.at(0);

    worker?.emit({
      type: "result",
      requestId: "request-clean",
      result: {
        id: "clean",
        fileName: "clean.png",
        status: "already-clean",
        scan: {
          fileId: "clean",
          fileName: "clean.png",
          format: "png",
          mimeType: "image/png",
          bytes: 1,
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

    const button = await screen.findByRole("button", { name: "Check Another Image" });
    await userEvent.click(button);
    expect(screen.queryByText("No supported AI label metadata was found.")).not.toBeInTheDocument();
  });

  it("collapses the mobile navigation behind a menu trigger instead of showing the full link list by default", async () => {
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    const { default: HomePage } = await import("@/app/page");
    render(<HomePage />);

    expect(screen.getByRole("button", { name: "Open navigation menu" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Instagram" })).not.toBeInTheDocument();
  });
});
