import type { FaqItem } from "@/content/faqs";
import type { BreadcrumbLink, PageContent } from "@/content/pages";
import { toAbsoluteUrl } from "./metadata";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Remove AI Label",
    url: toAbsoluteUrl("/"),
  };
}

export function buildWebApplicationSchema(page: PageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.title,
    url: toAbsoluteUrl(page.path),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    description: page.description,
  };
}

export function buildBreadcrumbSchema(breadcrumbs: BreadcrumbLink[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.label,
      item: toAbsoluteUrl(breadcrumb.href),
    })),
  };
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
