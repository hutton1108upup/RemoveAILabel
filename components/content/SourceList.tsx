import type { SourceLink } from "@/content/pages";

interface SourceListProps {
  items: readonly SourceLink[];
}

export function SourceList({ items }: SourceListProps) {
  return (
    <section className="source-list-section">
      <h2>Sources and evidence</h2>
      <p className="body-copy source-intro">
        Official sources support the factual claims on this page. User discussions show the
        questions people ask; they are not proof of platform behavior.
      </p>
      <div className="source-list-grid">
        {items.map((item) => (
          <article key={item.href} className="card source-card source-evidence-card">
            <p className="source-kind">{item.kind}</p>
            <h3>
              <a href={item.href} className="text-link" target="_blank" rel="noreferrer">
                {item.label}
              </a>
            </h3>
            <p>{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
