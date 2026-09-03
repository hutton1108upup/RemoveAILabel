import type { SourceLink } from "@/content/pages";

interface SourceListProps {
  items: readonly SourceLink[];
}

export function SourceList({ items }: SourceListProps) {
  return (
    <section className="source-list-section">
      <h2>Sources</h2>
      <p className="body-copy source-intro">
        Official documentation supports the platform and file-format claims below. Community posts
        show reported questions, not proof of platform behavior.
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
