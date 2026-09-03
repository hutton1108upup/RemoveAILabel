import type { MetadataRoute } from "next";
import { launchRouteOrder } from "@/content/pages";
import { toAbsoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return launchRouteOrder.map((path) => ({
    url: toAbsoluteUrl(path),
    lastModified: "2026-09-03",
  }));
}
