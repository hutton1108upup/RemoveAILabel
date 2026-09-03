import type { Metadata } from "next";
import type { PageContent } from "@/content/pages";

export const SITE_URL_FALLBACK = "https://removeailabel.app";

export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) {
    return SITE_URL_FALLBACK;
  }

  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
}

export function toAbsoluteUrl(path: string): string {
  const normalizedPath = path === "/" ? "/" : `${path.replace(/\/$/, "")}/`;
  return `${getSiteOrigin()}${normalizedPath}`;
}

export function buildMetadata(page: Pick<PageContent, "title" | "description" | "path">): Metadata {
  const url = toAbsoluteUrl(page.path);

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: "Remove AI Label",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}
