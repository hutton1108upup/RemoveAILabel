import type { MetadataRoute } from "next";
import { launchRouteOrder } from "@/content/pages";
import { scenarioPages, scenarioReviewDate } from "@/content/scenario-pages";
import { toAbsoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updatedRoutes = new Set([
    ...Object.values(scenarioPages).map((page) => page.path),
    "/guides",
    "/instagram-ai-info",
    "/facebook-ai-info",
    "/photoshop-ai-label",
  ]);
  return launchRouteOrder.map((path) => ({
    url: toAbsoluteUrl(path),
    lastModified: updatedRoutes.has(path) ? scenarioReviewDate : "2026-09-03",
  }));
}
