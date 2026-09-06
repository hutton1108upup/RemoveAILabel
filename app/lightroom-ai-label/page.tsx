import { getPageContent } from "@/content/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/content/JsonLd";
import { renderContentPage } from "../shared";

const page = getPageContent("lightroom-ai-label");

export const metadata = {
  ...buildMetadata(page),
  robots: { index: true, follow: true },
};

export default function LightroomPage() {
  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildBreadcrumbSchema(page.breadcrumbs ?? [])} />
      <JsonLd data={buildFaqSchema(page.faqs)} />
      {renderContentPage(page)}
    </>
  );
}
