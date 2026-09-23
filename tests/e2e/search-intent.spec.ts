import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

test("search-intent pages keep navigation, metadata and phone layouts usable", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["/", "/instagram-ai-info/", "/facebook-ai-info/", "/photoshop-ai-label/", "/c2pa-ai-label/", "/supported-formats/", "/remove-ai-label-iphone/", "/guides/"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://removeailabel.app${route}`);
    if (route === "/remove-ai-label-iphone/") {
      await page.getByText("See an example of the verified download", { exact: true }).click();
      const example = page.getByRole("img", { name: /Verified JPG result showing/ });
      await expect(example).toBeVisible();
      await expect(example).toHaveJSProperty("naturalWidth", 305);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll("/", "") || "home"}.png`), fullPage: true });
  }
  await page.getByRole("link", { name: "Open the free AI label remover", exact: true }).click();
  await expect(page).toHaveURL(/\/#use-free-tool$/);
  await expect(page.getByRole("button", { name: "Image file dropzone" })).toBeVisible();
  const order = await page.locator("main [data-home-section]").evaluateAll((sections) => sections.map((section) => section.getAttribute("data-home-section")));
  expect(order.indexOf("how-it-works")).toBeLessThan(order.indexOf("checks"));
  expect(order.indexOf("report")).toBeLessThan(order.indexOf("limits"));
  await page.getByRole("button", { name: "What does an AI tag remover remove?", exact: true }).click();
  // An already-open FAQ closes on click; open it if necessary before checking the answer.
  const faq = page.getByRole("button", { name: "What does an AI tag remover remove?", exact: true });
  if (await faq.getAttribute("aria-expanded") !== "true") await faq.click();
  await expect(page.locator(".faq-answer")).toContainText("It does not erase visible text or change labels on existing posts.");
  expect(errors).toEqual([]);
});

test("public sample produces a downloadable copy with identical decoded pixels", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  const input = await readFile("public/samples/adobe-20220124-CA.jpg");
  await page.goto("/");
  const tool = page.getByRole("region", { name: "Remove AI label tool" });
  await tool.getByRole("button", { name: "Try a sample image" }).click();
  await expect(tool.getByText("File-level clean copy ready").first()).toBeVisible({ timeout: 30_000 });
  await expect(tool.getByText("The embedded Content Credential was removed from the verified clean copy.")).toBeVisible();
  await tool.locator(".result-card").first().screenshot({ path: testInfo.outputPath("sample-result.png") });
  const downloadPromise = page.waitForEvent("download");
  await tool.getByRole("link", { name: "Download Cleaned Image", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("sample-adobe-export-clean.jpg");
  const output = await readFile((await download.path())!);
  const before = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const after = await sharp(output).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  expect(after.info).toEqual(before.info);
  expect(after.data.equals(before.data)).toBe(true);
  expect(output.length).toBeLessThan(input.length);
  const evidence = {
    source: "C2PA public test files: legacy/1.4/image/jpeg/adobe-20220124-CA.jpg",
    originalSha256: createHash("sha256").update(input).digest("hex"),
    originalBytes: input.length, cleanedBytes: output.length,
    width: before.info.width, height: before.info.height,
    decodedPixelsIdentical: true,
    scope: "Local file cleanup; not a current Photoshop export or a platform-label test",
  };
  await testInfo.attach("sample-evidence", { body: JSON.stringify(evidence, null, 2), contentType: "application/json" });
});
