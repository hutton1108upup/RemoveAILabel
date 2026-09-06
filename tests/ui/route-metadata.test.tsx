import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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
import LightroomPage, { metadata as lightroomMetadata } from "@/app/lightroom-ai-label/page";
import IphonePage, { metadata as iphoneMetadata } from "@/app/remove-ai-label-iphone/page";
import ThreadsPage, { metadata as threadsMetadata } from "@/app/threads-ai-info/page";
import PinterestPage, { metadata as pinterestMetadata } from "@/app/pinterest-ai-label/page";
import TiktokPhotoPage, { metadata as tiktokPhotoMetadata } from "@/app/tiktok-photo-ai-label/page";

afterEach(() => cleanup());

const expectedRoutes = [
  {
    path: "/lightroom-ai-label",
    title: "Lightroom AI Label: Check Your Export",
    h1: "Lightroom AI Labels: Check the Final Export",
    metadata: lightroomMetadata,
    Page: LightroomPage,
  },
  {
    path: "/remove-ai-label-iphone",
    title: "Remove AI Label on iPhone: Photo Guide",
    h1: "How to Remove AI Label Metadata on iPhone",
    metadata: iphoneMetadata,
    Page: IphonePage,
  },
  {
    path: "/threads-ai-info",
    title: "Threads AI Info: Photo Labels Explained",
    h1: "Threads AI Info: Check Photos Before Posting",
    metadata: threadsMetadata,
    Page: ThreadsPage,
  },
  {
    path: "/pinterest-ai-label",
    title: "Pinterest Gen AI Label: Check or Appeal",
    h1: "Pinterest Gen AI Labels: Check a Photo or Appeal",
    metadata: pinterestMetadata,
    Page: PinterestPage,
  },
  {
    path: "/tiktok-photo-ai-label",
    title: "TikTok Photo AI Label: Check Each Image",
    h1: "TikTok Photo AI Labels: Check Every Image",
    metadata: tiktokPhotoMetadata,
    Page: TiktokPhotoPage,
  },
  {
    path: "/",
    title: "Remove AI Label from Images — Free & Private Tool",
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
          ? "https://removeailabel.app/"
          : `https://removeailabel.app${route.path}/`,
      );
      expect(route.metadata.openGraph?.url).toBe(
        route.path === "/"
          ? "https://removeailabel.app/"
          : `https://removeailabel.app${route.path}/`,
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

  it("renders route-specific guidance with traceable evidence", () => {
    const pages = [
      {
        Page: PhotoshopPage,
        heading: "What to Check in the Export",
        officialSource: "Adobe: Export images with Content Credentials",
      },
      {
        Page: InstagramPage,
        heading: "What Instagram AI Info Tells You",
        officialSource: "Meta: How AI labels work on Facebook and Instagram",
      },
      {
        Page: FacebookPage,
        heading: "Why Facebook May Show AI Info",
        officialSource: "Meta: How AI labels work on Facebook and Instagram",
      },
      {
        Page: WhyAiInfoPage,
        heading: "Where AI Info Can Come From",
        officialSource: "Meta: How AI labels work on Facebook and Instagram",
      },
      {
        Page: C2paPage,
        heading: "What Changes in the Cleaned Copy",
        officialSource: "C2PA: Content Credentials specification",
      },
      {
        Page: SupportedFormatsPage,
        heading: "Keep or Remove Workflow Metadata?",
        officialSource: "W3C: Portable Network Graphics specification",
      },
    ];

    for (const page of pages) {
      const { unmount } = render(<page.Page />);
      expect(screen.getByRole("heading", { level: 2, name: page.heading })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: page.officialSource })).toHaveAttribute(
        "href",
        expect.stringMatching(/^https:\/\//),
      );
      expect(screen.getAllByText("Official source").length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("labels community reports as user discussions and answers the reported questions cautiously", () => {
    const { unmount } = render(<PhotoshopPage />);

    expect(screen.getAllByText("User discussion").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: "Which Photoshop tool triggered the AI Info label?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Does undoing Generative Fill remove every AI-related signal?" }),
    ).toBeInTheDocument();
    unmount();

    render(<InstagramPage />);
    expect(
      screen.getByRole("button", { name: "Can this remove AI Info from an Instagram post that is already live?" }),
    ).toBeInTheDocument();
  });

  it("discloses Clarity analytics without weakening the local-processing boundary", () => {
    render(<PrivacyPage />);

    expect(screen.getByRole("heading", { level: 2, name: "Selected Images Are Processed in Your Browser" })).toBeInTheDocument();
    expect(
      screen.getByText(/This version does not send selected image bytes, file names, prompts, workflow JSON, GPS, raw EXIF, raw XMP, image hashes, or thumbnails/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Microsoft Clarity Analytics" })).toBeInTheDocument();
    expect(screen.getByText(/page views and interactions such as clicks and scrolling/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics and ad storage denied by default/i)).toBeInTheDocument();
    expect(screen.getByText(/Selected image bytes, file names, prompts, workflow contents, GPS, raw metadata, hashes, and thumbnails are never included/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Microsoft Privacy Statement" })).toHaveAttribute(
      "href",
      "https://privacy.microsoft.com/en-us/privacystatement",
    );
    expect(screen.queryByText(/should not upload/i)).not.toBeInTheDocument();
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

    expect(robotsConfig.host).toBe("https://removeailabel.app");
    expect(robotsConfig.sitemap).toBe("https://removeailabel.app/sitemap.xml");
    expect(sitemapEntries).toHaveLength(16);
    expect(sitemapEntries.map((entry) => entry.url)).toEqual([
      "https://removeailabel.app/",
      "https://removeailabel.app/instagram-ai-info/",
      "https://removeailabel.app/facebook-ai-info/",
      "https://removeailabel.app/photoshop-ai-label/",
      "https://removeailabel.app/why-does-my-photo-say-ai-info/",
      "https://removeailabel.app/c2pa-ai-label/",
      "https://removeailabel.app/supported-formats/",
      "https://removeailabel.app/lightroom-ai-label/",
      "https://removeailabel.app/remove-ai-label-iphone/",
      "https://removeailabel.app/threads-ai-info/",
      "https://removeailabel.app/pinterest-ai-label/",
      "https://removeailabel.app/tiktok-photo-ai-label/",
      "https://removeailabel.app/guides/",
      "https://removeailabel.app/about/",
      "https://removeailabel.app/privacy/",
      "https://removeailabel.app/terms/",
    ]);
  });
});
