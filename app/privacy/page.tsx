import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "Read how Remove AI Label processes images locally, what data is not transmitted, and how temporary downloads are handled.",
});

export default function PrivacyPage() {
  return (
    <div className="page-shell">
      <Header />
      <main className="main-shell" role="main">
        <div className="shell narrow-page legal-stack" data-page-width="narrow">
          <h1>Privacy Policy</h1>
          <p className="evidence-note">Last updated: September 4, 2026</p>

          <section className="legal-section">
            <h2>Selected Images Are Processed in Your Browser</h2>
            <p>
              Image scanning, cleanup, verification, and ZIP preparation run locally in your browser.
              This tool does not upload selected images. The original file is not overwritten; when
              cleanup succeeds, the browser creates a separate downloadable copy.
            </p>
          </section>

          <section className="legal-section">
            <h2>What This Version Does Not Send</h2>
            <p>
              This version does not send selected image bytes, file names, prompts, workflow JSON,
              GPS, raw EXIF, raw XMP, image hashes, or thumbnails to an application server.
            </p>
            <p>
              File processing runs through a local Web Worker. The tool does not save selected-file
              data in cookies, localStorage, sessionStorage, or IndexedDB.
            </p>
          </section>

          <section className="legal-section">
            <h2>Microsoft Clarity Analytics</h2>
            <p>
              This site uses Microsoft Clarity to understand page views and interactions such as
              clicks and scrolling so we can improve the site. Clarity is initialized with analytics
              and ad storage denied by default, so it does not use Clarity cookies to link visits into
              a continuous cross-page session.
            </p>
            <p>
              The local processing tool is explicitly masked from Clarity. Selected image bytes,
              file names, prompts, workflow contents, GPS, raw metadata, hashes, and thumbnails are
              never included in Clarity analytics. Microsoft processes the remaining limited
              analytics data under the{` `}
              <a href="https://privacy.microsoft.com/en-us/privacystatement">
                Microsoft Privacy Statement
              </a>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2>Browser Memory and Downloads</h2>
            <p>
              Files are held in browser memory while they are being checked. Download links use
              temporary browser object URLs and are revoked when a result is removed, replaced, or
              the tool is closed. Saving a downloaded copy places it wherever your browser normally
              saves files.
            </p>
          </section>

          <section className="legal-section">
            <h2>Ordinary Website Requests</h2>
            <p>
              Your browser still requests the HTML, fonts, scripts, styles, and local C2PA files
              needed to load this static site. A hosting provider may receive ordinary request data,
              such as an IP address or browser headers, according to its own infrastructure and
              retention rules. Those requests do not include the images you select for processing.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
