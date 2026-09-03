import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  path: "/terms",
  title: "Terms of Use",
  description: "Read the usage boundaries, guarantees, and limitations for Remove AI Label.",
});

export default function TermsPage() {
  return (
    <div className="page-shell">
      <Header />
      <main className="main-shell" role="main">
        <div className="shell narrow-page legal-stack" data-page-width="narrow">
          <h1>Terms of Use</h1>
          <p>
            The tool creates a new local file copy when supported cleanup succeeds. It does not edit
            a third-party post, determine platform classification, or remove visible AI artifacts.
          </p>
          <p>
            Keep the original file when you need its provenance, Content Credentials, or export record.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
