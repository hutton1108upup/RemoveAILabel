import { ChecksGrid } from "@/components/content/ChecksGrid";
import { CapabilitySplit } from "@/components/content/CapabilitySplit";
import { FaqAccordion } from "@/components/content/FaqAccordion";
import { GuideCardGrid } from "@/components/content/GuideCardGrid";
import { JsonLd } from "@/components/content/JsonLd";
import { PreserveCard } from "@/components/content/PreserveCard";
import { ScenarioGrid } from "@/components/content/ScenarioGrid";
import { StepList } from "@/components/content/StepList";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { homePageContent } from "@/content/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildFaqSchema, buildOrganizationSchema, buildWebApplicationSchema } from "@/lib/seo/schema";
import { RemoveAiLabelTool } from "@/components/tool/RemoveAiLabelTool";
import type { ProcessFileResult } from "@/lib/metadata/types";
import { VerificationTable } from "@/components/tool/VerificationTable";
import { AppLink } from "@/components/layout/AppLink";

const page = {
  path: "/",
  title: homePageContent.title,
  description: homePageContent.description,
  h1: homePageContent.h1,
  faqs: homePageContent.faqs,
  slug: "home",
  indexable: true,
};

export const metadata = buildMetadata(page);

export default function HomePage() {
  const exampleResult: ProcessFileResult = {
    id: "example",
    fileName: "example.jpg",
    status: "ready",
    cleanedFileName: "example-clean.jpg",
    cleanedBytes: Uint8Array.of(1),
    scan: {
      fileId: "example",
      fileName: "example.jpg",
      format: "jpeg",
      mimeType: "image/jpeg",
      bytes: 1,
      findings: [
        {
          id: "c2pa-example",
          category: "c2pa",
          source: "C2PA",
          label: "Embedded C2PA",
          level: "confirmed",
          removable: true,
          autoRemoveEligible: true,
          explanation: "Embedded credential",
        },
        {
          id: "xmp-example",
          category: "ai-xmp",
          source: "XMP",
          label: "AI-related XMP",
          level: "confirmed",
          removable: true,
          autoRemoveEligible: true,
          explanation: "AI XMP",
        },
        {
          id: "workflow-example",
          category: "ai-workflow",
          source: "PNG_TEXT",
          label: "Prompt / workflow",
          level: "confirmed",
          removable: true,
          autoRemoveEligible: true,
          explanation: "Workflow data",
        },
      ],
      hasEmbeddedC2pa: true,
      hasConfirmedAiMetadata: true,
      hasPossibleAiMetadata: false,
      hasCameraExif: true,
      hasPrivacyMetadata: false,
      hasCopyright: true,
      hasIccProfile: true,
      payloadHash: "example",
      rewriteSafe: true,
      warnings: [],
    },
    verification: {
      removedFindingIds: ["c2pa-example", "xmp-example", "workflow-example"],
      remainingTargetFindingIds: [],
      preservedCategories: ["camera-exif", "copyright", "color-profile"],
      dimensionsUnchanged: true,
      encodedPayloadUnchanged: true,
      iccPreserved: true,
      orientationPreserved: true,
      c2paAbsentAfterCleanup: true,
      verified: true,
      warnings: [],
    },
  };

  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebApplicationSchema(page)} />
      <JsonLd data={buildFaqSchema(homePageContent.faqs)} />
      <div className="page-shell">
        <Header />
        <main className="main-shell" role="main">
          <section className="hero-section" data-home-section="hero" id="use-free-tool">
            <div className="shell">
              <div className="hero-copy">
                <p className="eyebrow">Free local image tool</p>
                <h1>{homePageContent.h1}</h1>
                <p className="body-large">{homePageContent.subtitle}</p>
                <div className="trust-badges">
                  {homePageContent.trustBadges.map((badge) => (
                    <span key={badge} className="trust-chip">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <RemoveAiLabelTool />
            </div>
          </section>

          <div className="shell section-stack">
            <div data-home-section="checks">
              <ChecksGrid title="What This Tool Checks" items={homePageContent.checks} />
            </div>

            <div data-home-section="preserves">
              <PreserveCard title="What It Preserves" items={homePageContent.preserves} />
            </div>

            <section data-home-section="limits" data-surface="navy" className="capability-wrap">
              <h2>What It Cannot Guarantee</h2>
              <CapabilitySplit
                dark
                canTitle="What this tool can do"
                canItems={homePageContent.canDo}
                cannotTitle="What it cannot do"
                cannotItems={homePageContent.cannotDo}
              />
              <div className="card-grid card-grid-four source-grid">
                {homePageContent.evidenceSources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="card source-card"
                  >
                    <h3>{source.label}</h3>
                    <p>Official reference</p>
                  </a>
                ))}
              </div>
            </section>

            <div data-home-section="scenarios">
              <ScenarioGrid title="Who This Helps" items={homePageContent.scenarios} />
            </div>

            <div data-home-section="how-it-works" id="how-it-works">
              <StepList title="How It Works" steps={homePageContent.workflow} />
            </div>

            <section data-home-section="report">
              <h2>Before / After Report</h2>
              <article className="card result-card">
                <h3>Example verification report</h3>
                <VerificationTable result={exampleResult} />
                <button type="button" className="button button-secondary" disabled>
                  Download example report
                </button>
              </article>
            </section>

            <div data-home-section="guides">
              <GuideCardGrid title="Start with a Specific Guide" items={homePageContent.entryCards} />
            </div>

            <div data-home-section="faq">
              <FaqAccordion items={homePageContent.faqs} />
            </div>

            <section data-home-section="cta">
              <div className="cta-section">
                <h2>Use the Free Tool Before You Post</h2>
                <p className="body-large">
                  Inspect supported file-level AI label metadata locally, create a cleaned copy, and verify the result before you publish.
                </p>
                <AppLink href="/#use-free-tool" className="button button-primary">
                  Use Free Tool
                </AppLink>
                <p className="mono-copy">No sign-up · No upload · Works offline</p>
              </div>
            </section>
          </div>
        </main>
        <Footer siteBLabel={homePageContent.footerSiteBLabel} />
      </div>
    </>
  );
}
