import { Check } from "lucide-react";

interface PreserveCardProps {
  title?: string;
  items: readonly string[];
}

export function PreserveCard({ title, items }: PreserveCardProps) {
  return (
    <section>
      {title ? <h2>{title}</h2> : null}
      <article className="card card-accent">
        <ul className="preserve-list">
          {items.map((item) => (
            <li key={item}>
              <Check size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
