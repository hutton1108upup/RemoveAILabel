interface ScenarioGridProps {
  title?: string;
  items: ReadonlyArray<{ title: string; description: string }>;
}

export function ScenarioGrid({ title, items }: ScenarioGridProps) {
  return (
    <section>
      {title ? <h2>{title}</h2> : null}
      <div className="card-grid card-grid-four">
        {items.map((item) => (
          <article key={item.title} className="card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
