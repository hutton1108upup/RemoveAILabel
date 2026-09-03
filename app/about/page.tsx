import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  path: "/about",
  title: "About Remove AI Label",
  description: "Learn what the Remove AI Label tool is built to check, clean, and preserve.",
});

export default function AboutPage() {
  return (
    <div className="page-shell">
      <Header />
      <main className="main-shell" role="main">
        <div className="shell narrow-page legal-stack" data-page-width="narrow">
          <h1>About Remove AI Label</h1>
          <p>
            Remove AI Label is a browser-based tool for checking and cleaning supported AI-related
            metadata before you post or deliver an image.
          </p>
          <p>
            It checks file-level data such as embedded C2PA credentials, AI-related XMP, and supported
            prompt or workflow fields. It does not change visible pixels or promise a platform result.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
