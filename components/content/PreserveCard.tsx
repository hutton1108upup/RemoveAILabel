interface PreserveCardProps {
  title: string;
  items: readonly string[];
}

export function PreserveCard({ title, items }: PreserveCardProps) {
  return (
    <section>
      <h2>{title}</h2>
      <article className="card card-accent">
        <ul className="preserve-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
