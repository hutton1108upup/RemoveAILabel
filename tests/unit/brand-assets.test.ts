import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

const fromRoot = (filePath: string) => path.resolve(process.cwd(), filePath);

describe("brand icon assets", () => {
  it("ships an opaque 180px Apple touch icon", async () => {
    const metadata = await sharp(fromRoot("app/apple-icon.png")).metadata();

    expect(metadata.width).toBe(180);
    expect(metadata.height).toBe(180);
    expect(metadata.hasAlpha).toBe(false);
  });

  it("ships opaque 192px and 512px install icons", async () => {
    const icons = [
      ["public/brand/remove-ai-label-icon-192.png", 192],
      ["public/brand/remove-ai-label-icon-512.png", 512],
    ] as const;

    for (const [filePath, expectedSize] of icons) {
      expect(fs.existsSync(fromRoot(filePath)), `${filePath} should exist`).toBe(true);
      if (!fs.existsSync(fromRoot(filePath))) {
        return;
      }

      const metadata = await sharp(fromRoot(filePath)).metadata();
      expect(metadata.width).toBe(expectedSize);
      expect(metadata.height).toBe(expectedSize);
      expect(metadata.hasAlpha).toBe(false);
    }
  });

  it("keeps the reusable master mark transparent", async () => {
    const metadata = await sharp(fromRoot("public/brand/remove-ai-label-mark-1024.png")).metadata();

    expect(metadata.width).toBe(1024);
    expect(metadata.height).toBe(1024);
    expect(metadata.hasAlpha).toBe(true);
  });
});
