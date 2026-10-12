import type { MetadataRoute } from "next";
import { launchRouteOrder } from "@/content/pages";
import { scenarioPages, scenarioReviewDate } from "@/content/scenario-pages";
import { toAbsoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mvpUpdatedRoutes = new Set([
    "/", "/instagram-ai-info", "/why-does-my-photo-say-ai-info",
    "/supported-formats", "/ai-label-after-metadata-removal", "/guides",
  ]);
  const contentUpdatedRoutes = new Set([
    "/", "/instagram-ai-info", "/facebook-ai-info", "/photoshop-ai-label",
    "/c2pa-ai-label", "/supported-formats", "/remove-ai-label-iphone", "/guides",
  ]);
  const updatedRoutes = new Set([
    ...Object.values(scenarioPages).map((page) => page.path),
    "/guides",
    "/instagram-ai-info",
    "/facebook-ai-info",
    "/photoshop-ai-label",
  ]);
  return launchRouteOrder.map((path) => ({
    url: toAbsoluteUrl(path),
    lastModified: mvpUpdatedRoutes.has(path)
      ? "2026-10-12"
      : contentUpdatedRoutes.has(path)
      ? "2026-09-23"
      : updatedRoutes.has(path) ? scenarioReviewDate : "2026-09-03",
  }));
}
