import { FileSearch, Info, ShieldCheck, WandSparkles } from "lucide-react";
import type { GuideCard } from "@/content/pages";
import { AppLink } from "@/components/layout/AppLink";

interface GuideCardGridProps {
  title: string;
  items: readonly GuideCard[];
}

export function GuideCardGrid({ title, items }: GuideCardGridProps) {
  const icons = [Info, WandSparkles, ShieldCheck, FileSearch];

  return (
    <section>
      <h2>{title}</h2>
      <div className="card-grid card-grid-four">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
          <article key={item.href} className="card">
            <div className="card-icon">
              <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <AppLink href={item.href} className="text-link">
              Guide →
            </AppLink>
          </article>
          );
        })}
      </div>
    </section>
  );
}
