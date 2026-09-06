import { expect, test } from "@playwright/test";
import { unzipSync } from "fflate";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  ascii,
  buildPng,
  pngText,
} from "../fixtures/builders";

const launchRoutes = [
  "/",
  "/instagram-ai-info/",
  "/facebook-ai-info/",
  "/photoshop-ai-label/",
  "/why-does-my-photo-say-ai-info/",
  "/c2pa-ai-label/",
  "/supported-formats/",
  "/lightroom-ai-label/",
  "/remove-ai-label-iphone/",
  "/threads-ai-info/",
  "/pinterest-ai-label/",
  "/tiktok-photo-ai-label/",
  "/guides/",
  "/about/",
  "/privacy/",
  "/terms/",
] as const;

function pngFile(name: string, withAiMetadata = false) {
  const bytes = buildPng({
    chunks: withAiMetadata
      ? [pngText("parameters", "Steps: 20, Sampler: Euler, Seed: 42")]
      : [],
  });
  return { name, mimeType: "image/png", buffer: Buffer.from(bytes) };
}

test("every launch route and static SEO endpoint opens", async ({ page, request }) => {
  for (const route of launchRoutes) {
    const response = await page.goto(route);
    expect(response?.ok(), route).toBeTruthy();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/removeailabel\.app\//);
  }

  for (const route of ["/robots.txt", "/sitemap.xml", "/icon.svg", "/opengraph-image"]) {
    const response = await request.get(route);
    expect(response.ok(), route).toBeTruthy();
  }
});

test("mobile page hydrates without runtime or console errors", async ({ page }) => {
  test.skip(page.viewportSize()?.width !== 375, "This regression targets the mobile hydration path.");
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("content route keeps the breadcrumb close to the header", async ({ page }) => {
  await page.goto("/instagram-ai-info/");
  await page.waitForLoadState("networkidle");

  const header = await page.locator(".site-header").boundingBox();
  const breadcrumbs = await page.locator(".breadcrumbs").boundingBox();
  expect(header).not.toBeNull();
  expect(breadcrumbs).not.toBeNull();

  const gap = breadcrumbs!.y - (header!.y + header!.height);
  expect(gap).toBeGreaterThanOrEqual(40);
  expect(gap).toBeLessThanOrEqual(72);
});

test("already-clean file is not rewritten and can reset", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Choose image files").setInputFiles(pngFile("camera-clean.png"));

  await expect(page.getByText("No supported AI-label fields were found in this file.").first()).toBeVisible();
  await expect(page.getByText("The original file was not rewritten.").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Download Cleaned Image" })).toHaveCount(0);
  await expect(page.getByText("Review visible artifacts")).toHaveCount(0);

  await page.getByRole("button", { name: "Check Another Image" }).click();
  await expect(page.getByText("camera-clean.png")).toHaveCount(0);
});

test("confirmed PNG metadata is cleaned, verified, regenerated, and downloaded", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Choose image files").setInputFiles(pngFile("prompt.png", true));

  await expect(page.locator(".result-card").getByText("File-level clean copy ready").first()).toBeVisible();
  const result = page.locator(".result-card").first();
  await expect(result.getByText("Prompt / workflow")).toBeVisible();
  await expect(result.getByText("Removed").first()).toBeVisible();
  await expect(result.getByText("Not re-encoded")).toBeVisible();

  await result.getByRole("button", { name: "Advanced Options" }).click();
  await result.getByLabel("Remove GPS, device, date, and other EXIF details").check();
  await result.getByRole("button", { name: "Create New Clean Copy" }).click();
  await expect(page.locator(".result-card").getByText("File-level clean copy ready").first()).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download Cleaned Image" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("prompt-clean.png");
});

test("one failed file does not block verified files and ZIP contains successes only", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Choose image files").setInputFiles([
    pngFile("first.png", true),
    { name: "broken.jpg", mimeType: "image/jpeg", buffer: Buffer.from(ascii("not-a-jpeg")) },
    pngFile("second.png", true),
  ]);

  await expect(page.getByText("2 verified copies ready")).toBeVisible();
  await expect(page.getByText("Processing failed.")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download 2 Verified Files as ZIP" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const zipBytes = await readFile(downloadPath!);
  expect(Object.keys(unzipSync(zipBytes)).sort()).toEqual(["first-clean.png", "second-clean.png"]);
});

test("file processing makes no upload or filename request", async ({ page }) => {
  const requests: Array<{ method: string; url: string }> = [];
  page.on("request", (request) => requests.push({ method: request.method(), url: request.url() }));

  await page.goto("/");
  requests.length = 0;
  await page.getByLabel("Choose image files").setInputFiles(pngFile("private-prompt.png", true));
  await expect(page.locator(".result-card").getByText("File-level clean copy ready").first()).toBeVisible();

  expect(requests.every((request) => request.method === "GET" || request.method === "HEAD")).toBe(true);
  expect(requests.some((request) => request.url.includes("private-prompt.png"))).toBe(false);
});

test("official Adobe C2PA JPEG is read by the browser SDK and safely cleaned", async ({ page }) => {
  test.skip(page.viewportSize()?.width === 375, "Run the WASM interoperability fixture once on desktop.");
  const fixture = path.resolve("tests/fixtures/official/adobe-20220124-CA.jpg");
  await page.goto("/");
  await page.getByLabel("Choose image files").setInputFiles(fixture);

  await expect(page.locator(".result-card").getByText("File-level clean copy ready").first()).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Embedded C2PA").first()).toBeVisible();
  await expect(page.getByText("This file contains an embedded Content Credential.")).toBeVisible();
});

test("dropzone is keyboard operable and the 375px layout does not overflow", async ({ page }) => {
  await page.goto("/");
  const dropzone = page.getByRole("button", {
    name: "Image file dropzone",
  });
  await dropzone.focus();
  await expect(dropzone).toBeFocused();

  const chooserPromise = page.waitForEvent("filechooser");
  await dropzone.press("Enter");
  const chooser = await chooserPromise;
  await chooser.setFiles(pngFile("keyboard.png"));
  await expect(page.getByText("No supported AI-label fields were found in this file.").first()).toBeVisible();

  if (page.viewportSize()?.width === 375) {
    const menu = page.getByRole("button", { name: "Open navigation menu" });
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    const sizes = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.viewport);
  }
  await expect(page.getByText(/Uploading/i)).toHaveCount(0);
});
