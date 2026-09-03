import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import HomePage, { metadata as homeMetadata } from "@/app/page";
import InstagramPage, { metadata as instagramMetadata } from "@/app/instagram-ai-info/page";
import FacebookPage, { metadata as facebookMetadata } from "@/app/facebook-ai-info/page";
import PhotoshopPage, { metadata as photoshopMetadata } from "@/app/photoshop-ai-label/page";
import WhyAiInfoPage, { metadata as whyAiInfoMetadata } from "@/app/why-does-my-photo-say-ai-info/page";
import C2paPage, { metadata as c2paMetadata } from "@/app/c2pa-ai-label/page";
import SupportedFormatsPage, { metadata as supportedFormatsMetadata } from "@/app/supported-formats/page";
import GuidesPage, { metadata as guidesMetadata } from "@/app/guides/page";
import AboutPage from "@/app/about/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";

const expectedRoutes = [
  {
    path: "/",
    title: "Remove AI Label from Images - Free & Private Tool",
    h1: "Check and Remove AI Label Metadata Before You Post",
    metadata: homeMetadata,
    Page: HomePage,
  },
  {
    path: "/instagram-ai-info",
    title: "Instagram AI Info on Photos: What You Can Check",
    h1: "Why Instagram Shows AI Info on Some Photos",
    metadata: instagramMetadata,
    Page: InstagramPage,
  },
  {
    path: "/facebook-ai-info",
    title: "Facebook AI Info on Photos: File Signals Explained",
    h1: "Why Facebook Adds AI Info to Some Photos",
    metadata: facebookMetadata,
    Page: FacebookPage,
  },
  {
    path: "/photoshop-ai-label",
    title: "Photoshop Generative Fill AI Label: Check the Export",
    h1: "Check Photoshop Exports for AI Label Metadata",
    metadata: photoshopMetadata,
    Page: PhotoshopPage,
  },
  {
    path: "/why-does-my-photo-say-ai-info",
    title: "Why Does My Photo Say AI Info? Signals Explained",
    h1: "Why Does My Real Photo Say “AI Info”?",
    metadata: whyAiInfoMetadata,
    Page: WhyAiInfoPage,
  },
  {
    path: "/c2pa-ai-label",
    title: "C2PA and AI Labels: What Content Credentials Mean",
    h1: "How C2PA Content Credentials Relate to AI Labels",
    metadata: c2paMetadata,
    Page: C2paPage,
  },
  {
    path: "/supported-formats",
    title: "Supported Formats and Metadata Fields",
    h1: "Supported Image Formats and Metadata",
    metadata: supportedFormatsMetadata,
    Page: SupportedFormatsPage,
  },
  {
    path: "/guides",
    title: "AI Info and Image Label Guides",
    h1: "AI Label and AI Info Guides",
    metadata: guidesMetadata,
    Page: GuidesPage,
  },
];

describe("route metadata and static seo", () => {
  it("ships unique TDH and canonical metadata for every launch route", () => {
    const titles = new Set(expectedRoutes.map((route) => route.title));
    const h1s = new Set(expectedRoutes.map((route) => route.h1));

    expect(titles.size).toBe(expectedRoutes.length);
    expect(h1s.size).toBe(expectedRoutes.length);

    for (const route of expectedRoutes) {
      expect(route.metadata.title).toBe(route.title);
      expect(route.metadata.alternates?.canonical).toBe(
        route.path === "/"
          ? "https://removeailabel.com/"
          : `https://removeailabel.com${route.path}/`,
      );
      expect(route.metadata.openGraph?.url).toBe(
        route.path === "/"
          ? "https://removeailabel.com/"
          : `https://removeailabel.com${route.path}/`,
      );
      expect(
        route.metadata.twitter && "card" in route.metadata.twitter
          ? route.metadata.twitter.card
          : undefined,
      ).toBe("summary_large_image");
    }
  });

  it("renders the expected H1 on each launch route", () => {
    for (const route of expectedRoutes) {
      const { unmount } = render(<route.Page />);
      expect(screen.getByRole("heading", { level: 1, name: route.h1 })).toBeInTheDocument();
      unmount();
    }
  });

  it("renders the legal routes as readable narrow pages", () => {
    const pages = [
      { Page: AboutPage, heading: "About Remove AI Label" },
      { Page: PrivacyPage, heading: "Privacy Policy" },
      { Page: TermsPage, heading: "Terms of Use" },
    ];

    for (const page of pages) {
      const { container, unmount } = render(<page.Page />);
      expect(screen.getByRole("heading", { level: 1, name: page.heading })).toBeInTheDocument();
      expect(container.querySelector("[data-page-width='narrow']")).toBeTruthy();
      unmount();
    }
  });

  it("disables Next prefetch on internal navigation links", () => {
    const { container } = render(<HomePage />);
    const internalLinks = Array.from(container.querySelectorAll("a[href^='/'], a[href^='#']"));
    expect(internalLinks.length).toBeGreaterThan(0);
    for (const link of internalLinks) {
      expect(link).toHaveAttribute("data-prefetch", "false");
    }
  });

  it("builds robots.txt and sitemap.xml from the site-url fallback", async () => {
    const robotsConfig = robots();
    const sitemapEntries = await sitemap();

    expect(robotsConfig.host).toBe("https://removeailabel.com");
    expect(robotsConfig.sitemap).toBe("https://removeailabel.com/sitemap.xml");
    expect(sitemapEntries).toHaveLength(11);
    expect(sitemapEntries.map((entry) => entry.url)).toEqual([
      "https://removeailabel.com/",
      "https://removeailabel.com/instagram-ai-info/",
      "https://removeailabel.com/facebook-ai-info/",
      "https://removeailabel.com/photoshop-ai-label/",
      "https://removeailabel.com/why-does-my-photo-say-ai-info/",
      "https://removeailabel.com/c2pa-ai-label/",
      "https://removeailabel.com/supported-formats/",
      "https://removeailabel.com/guides/",
      "https://removeailabel.com/about/",
      "https://removeailabel.com/privacy/",
      "https://removeailabel.com/terms/",
    ]);
  });
});
