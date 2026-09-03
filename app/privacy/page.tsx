import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description: "Review the local-processing and no-upload privacy boundaries for Remove AI Label.",
});

export default function PrivacyPage() {
  return (
    <div className="page-shell">
      <Header />
      <main className="main-shell" role="main">
        <div className="shell narrow-page legal-stack" data-page-width="narrow">
          <h1>Privacy Policy</h1>
          <p>
            The tool is designed for local processing. It should not upload image bytes, file names,
            prompts, GPS, raw EXIF, or raw XMP to a server.
          </p>
          <p>
            Optional analytics are limited to anonymous enum-style event data such as page slug,
            format bucket, and result bucket, and default to a no-op adapter when no provider is
            configured.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
