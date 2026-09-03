import type { BreadcrumbLink } from "@/content/pages";
import { AppLink } from "@/components/layout/AppLink";

interface BreadcrumbsProps {
  items: BreadcrumbLink[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={item.href} className="breadcrumb-item">
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <AppLink href={item.href}>{item.label}</AppLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
