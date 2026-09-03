import type { EditorialSectionContent } from "@/content/pages";

interface EditorialSectionProps {
  section: EditorialSectionContent;
}

export function EditorialSection({ section }: EditorialSectionProps) {
  return (
    <section className="editorial-section">
      <h2>{section.title}</h2>
      <div className="editorial-copy">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.bullets?.length ? (
        <ul className="plain-list editorial-list">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
