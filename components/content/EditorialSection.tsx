import type { EditorialSectionContent } from "@/content/pages";
import { AppLink } from "@/components/layout/AppLink";
import Image from "next/image";

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
      {section.table ? (
        <table className="content-table" data-columns={section.table.columns.length}>
          <caption>{section.table.caption}</caption>
          <thead>
            <tr>{section.table.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {section.table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => index === 0
                  ? <th scope="row" key={index}>{cell}</th>
                  : <td key={index}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {section.bullets?.length ? (
        <ul className="plain-list editorial-list">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      {section.links?.length ? (
        <ul className="plain-list editorial-list">
          {section.links.map((link) => (
            <li key={link.href}><AppLink href={link.href}>{link.label}</AppLink></li>
          ))}
        </ul>
      ) : null}
      {section.illustration ? (
        <details className="editorial-example">
          <summary>See an example of the verified download</summary>
          <figure>
            <Image
              src={section.illustration.src}
              alt={section.illustration.alt}
              width={section.illustration.width}
              height={section.illustration.height}
            />
            <figcaption>{section.illustration.caption}</figcaption>
          </figure>
        </details>
      ) : null}
    </section>
  );
}
