import { Check, X } from "lucide-react";

interface CapabilitySplitProps {
  canTitle: string;
  canItems: readonly string[];
  cannotTitle: string;
  cannotItems: readonly string[];
  dark?: boolean;
}

export function CapabilitySplit({
  canTitle,
  canItems,
  cannotTitle,
  cannotItems,
  dark = false,
}: CapabilitySplitProps) {
  return (
    <div className={`capability-split${dark ? " capability-split-dark" : ""}`}>
      <article className="card capability-card">
        <h3>{canTitle}</h3>
        <ul className="icon-list">
          {canItems.map((item) => (
            <li key={item}>
              <Check size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="card capability-card">
        <h3>{cannotTitle}</h3>
        <ul className="icon-list icon-list-danger">
          {cannotItems.map((item) => (
            <li key={item}>
              <X size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
