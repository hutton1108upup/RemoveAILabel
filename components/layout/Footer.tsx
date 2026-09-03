import { footerGuideLinks, footerSiteLinks } from "@/content/navigation";
import { AppLink } from "./AppLink";

interface FooterProps {
  siteBLabel?: string;
}

export function Footer({ siteBLabel = "Explore the companion visual cleanup site" }: FooterProps) {
  const siteBUrl = process.env.NEXT_PUBLIC_SITE_B_URL?.trim();

  return (
    <footer className="site-footer" data-home-section="footer">
      <div className="shell footer-grid">
        <div>
          <AppLink href="/" className="brand-mark">
            Remove AI Label
          </AppLink>
          <p className="body-copy">
            A free local tool for checking and cleaning supported AI label metadata before you post.
          </p>
          <p className="mono-copy">© 2026 Remove AI Label</p>
        </div>
        <div>
          <h3>Guides</h3>
          <ul className="footer-list">
            {footerGuideLinks.map((item) => (
              <li key={item.href}>
                <AppLink href={item.href}>{item.label}</AppLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Site</h3>
          <ul className="footer-list">
            {footerSiteLinks.map((item) => (
              <li key={item.href}>
                <AppLink href={item.href}>{item.label}</AppLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Companion</h3>
          {siteBUrl && siteBLabel ? (
            <a href={siteBUrl} className="text-link" target="_blank" rel="noreferrer">
              {siteBLabel}
            </a>
          ) : (
            <p className="body-copy">Visible cleanup guidance appears only when the companion site is configured.</p>
          )}
        </div>
      </div>
    </footer>
  );
}
