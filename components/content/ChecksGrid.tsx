import { BadgeCheck, FileCode2, ScanSearch, Shield } from "lucide-react";

interface ChecksGridProps {
  title?: string;
  items: ReadonlyArray<{ title: string; description: string }>;
}

export function ChecksGrid({ title, items }: ChecksGridProps) {
  const icons = [BadgeCheck, ScanSearch, FileCode2, Shield];

  return (
    <section>
      {title ? <h2>{title}</h2> : null}
      <div className="card-grid card-grid-four">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
          <article key={item.title} className="card">
            <div className="card-icon">
              <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
          );
        })}
      </div>
    </section>
  );
}
