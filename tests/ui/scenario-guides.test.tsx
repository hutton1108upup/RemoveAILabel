import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { renderContentPage } from "@/app/shared";
import GuidesPage from "@/app/guides/page";
import sitemap from "@/app/sitemap";
import { getPageContent, launchPages } from "@/content/pages";

afterEach(cleanup);

const scenarios = [
  ["lightroom-ai-label", "helpx.adobe.com"],
  ["remove-ai-label-iphone", "support.apple.com"],
  ["threads-ai-info", "about.fb.com"],
  ["pinterest-ai-label", "help.pinterest.com"],
  ["tiktok-photo-ai-label", "support.tiktok.com"],
] as const;

describe("approved scenario guides", () => {
  it.each(scenarios)("%s has its own accessible guidance and official evidence", (slug, sourceHost) => {
    const page = getPageContent(slug);
    expect(page, `Missing approved guide: ${slug}`).toBeDefined();
    expect(page.indexable).toBe(true);
    const { container } = render(renderContentPage(page));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(page.h1);
    expect(screen.getByLabelText("Choose image files")).toBeInTheDocument();
    expect(page.editorialSections!.length).toBeGreaterThanOrEqual(2);
    expect(page.sources!.some((source) => new URL(source.href).hostname === sourceHost)).toBe(true);
    expect(page.breadcrumbs?.at(-1)?.href).toBe(`/${slug}/`);
    expect(container.querySelectorAll(".faq-button").length).toBeGreaterThanOrEqual(4);
    for (const related of page.relatedGuides ?? []) {
      expect(Object.values(launchPages).some((candidate) => `${candidate.path}/` === related.href)).toBe(true);
      expect(related.href).not.toBe(`/${slug}/`);
    }
  });

  it("makes all five guides discoverable from the guide directory and sitemap", async () => {
    const { container } = render(<GuidesPage />);
    const entries = await sitemap();
    // Next Link normalizes trailing slashes differently outside a Next build.
    const links = Array.from(container.querySelectorAll("main a")).map((link) =>
      link.getAttribute("href")?.replace(/\/$/, ""),
    );
    for (const [slug] of scenarios) {
      expect(links, slug).toContain(`/${slug}`);
      expect(entries.find((entry) => entry.url.endsWith(`/${slug}/`))?.lastModified).toBe("2026-09-06");
    }
    expect(entries.find((entry) => entry.url === "https://removeailabel.app/")?.lastModified).toBe("2026-09-03");
  });

  it("gives the new guides distinct titles, descriptions, and primary headings", () => {
    const pages = Object.values(launchPages);
    for (const [slug] of scenarios) {
      const page = getPageContent(slug);
      expect(page).toBeDefined();
      for (const field of ["title", "description", "h1"] as const) {
        expect(pages.filter((candidate) => candidate[field] === page[field])).toHaveLength(1);
      }
    }
  });
});
