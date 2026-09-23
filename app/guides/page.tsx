import { FaqAccordion } from "@/components/content/FaqAccordion";
import { GuideCardGrid } from "@/components/content/GuideCardGrid";
import { RouteHero } from "@/components/content/RouteHero";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getPageContent } from "@/content/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/content/JsonLd";
import { AppLink } from "@/components/layout/AppLink";

const page = getPageContent("guides");

export const metadata = buildMetadata(page);

export default function GuidesPage() {
  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildBreadcrumbSchema(page.breadcrumbs ?? [])} />
      <JsonLd data={buildFaqSchema(page.faqs)} />
      <div className="page-shell">
        <Header />
        <main className="main-shell" role="main">
          <div className="shell route-stack">
            <RouteHero heading={page.h1} description={page.quickAnswer} />
            <section className="card card-accent">
              <h2>Ready to Check an Image?</h2>
              <p>Use the free AI label remover to check a JPG or PNG in your browser. Choose a guide below when you need help with a platform notice, an export, or a phone download.</p>
              <AppLink href="/#use-free-tool" className="button button-primary">Open the free AI label remover</AppLink>
            </section>
            <GuideCardGrid title="Find Your Photo Workflow" items={page.relatedGuides ?? []} />
            <FaqAccordion items={page.faqs} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
