import { FaqAccordion } from "@/components/content/FaqAccordion";
import { GuideCardGrid } from "@/components/content/GuideCardGrid";
import { RouteHero } from "@/components/content/RouteHero";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getPageContent } from "@/content/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/content/JsonLd";

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
            <GuideCardGrid title="Launch Guides" items={page.relatedGuides ?? []} />
            <FaqAccordion items={page.faqs} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
