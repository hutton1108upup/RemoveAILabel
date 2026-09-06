import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { buildPng, pngText } from "../fixtures/builders";

const routes = [
  "/lightroom-ai-label/",
  "/remove-ai-label-iphone/",
  "/threads-ai-info/",
  "/pinterest-ai-label/",
  "/tiktok-photo-ai-label/",
];

for (const route of routes) {
  test(`${route} has consistent SEO, usable FAQs, and a working local download`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://removeailabel.app${route}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description!.length).toBeGreaterThan(100);
    expect(description!.length).toBeLessThanOrEqual(165);
    expect((await page.title()).length).toBeLessThanOrEqual(65);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description!);
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
      nodes.map((node) => JSON.parse(node.textContent ?? "{}")),
    );
    const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
    const breadcrumbs = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
    expect(breadcrumbs.itemListElement.at(-1).item).toBe(`https://removeailabel.app${route}`);
    expect(await page.locator(".faq-button").count()).toBe(faq.mainEntity.length);
    await page.screenshot({ path: testInfo.outputPath("page-full.png"), fullPage: true });
    for (const question of faq.mainEntity) {
      const button = page.getByRole("button", { name: question.name, exact: true });
      if (await button.getAttribute("aria-expanded") !== "true") await button.click();
      await expect(page.locator(".faq-answer")).toHaveText(question.acceptedAnswer.text);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByLabel("Choose image files").setInputFiles({
      name: "scenario-test.png",
      mimeType: "image/png",
      buffer: Buffer.from(buildPng({ chunks: [pngText("parameters", "Steps: 20, Sampler: Euler, Seed: 42")] })),
    });
    await expect(page.locator(".result-card").getByText("File-level clean copy ready").first()).toBeVisible();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download Cleaned Image", exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("scenario-test-clean.png");
    const output = await readFile((await download.path())!);
    expect(output.includes(Buffer.from("Steps: 20"))).toBe(false);
    expect(output.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(errors).toEqual([]);
  });
}

test("guide directory exposes the five new routes without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("/guides/");
  await page.waitForLoadState("networkidle");
  for (const route of routes) await expect(page.locator(`main a[href='${route}']`)).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("guides-full.png"), fullPage: true });
  await page.locator("main a[href='/lightroom-ai-label/']").click();
  await expect(page).toHaveURL(/\/lightroom-ai-label\/$/);
  await expect(page.locator("h1")).toContainText("Lightroom");
});
