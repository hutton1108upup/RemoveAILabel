import { getPageContent } from "@/content/pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/content/JsonLd";
import { renderContentPage } from "../shared";

const page = getPageContent("ai-label-after-metadata-removal");
export const metadata = buildMetadata(page);

export default function TroubleshootingPage() {
  return <>
    <JsonLd data={buildOrganizationSchema()} />
    <JsonLd data={buildBreadcrumbSchema(page.breadcrumbs ?? [])} />
    <JsonLd data={buildFaqSchema(page.faqs)} />
    {renderContentPage(page)}
  </>;
}
