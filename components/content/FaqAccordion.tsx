"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/content/faqs";

interface FaqAccordionProps {
  items: FaqItem[];
  showTitle?: boolean;
}

export function FaqAccordion({ items, showTitle = true }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section>
      {showTitle ? <h2>FAQ</h2> : null}
      <div className="faq-shell">
        {items.map((item, index) => {
          const expanded = openIndex === index;
          return (
            <div key={item.question} className="faq-item">
              <button
                type="button"
                className="faq-button"
                aria-expanded={expanded}
                onClick={() => setOpenIndex(expanded ? -1 : index)}
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={`faq-chevron${expanded ? " is-open" : ""}`}
                />
              </button>
              {expanded ? <p className="faq-answer">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
