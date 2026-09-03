import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Remove AI Label",
    short_name: "Remove AI Label",
    description: "Check and clean supported AI-related image metadata locally in your browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#0D9487",
    icons: [
      {
        src: "/brand/remove-ai-label-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/remove-ai-label-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
