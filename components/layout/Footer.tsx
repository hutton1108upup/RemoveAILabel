import { footerGuideLinks, footerSiteLinks } from "@/content/navigation";
import { AppLink } from "./AppLink";

export function Footer() {
  const siteBUrl = process.env.NEXT_PUBLIC_SITE_B_URL?.trim();
  const siteBBrand = process.env.NEXT_PUBLIC_SITE_B_BRAND?.trim();

  return (
    <footer className="site-footer" data-home-section="footer">
      <div className="shell footer-grid">
        <div>
          <AppLink href="/" className="brand-mark">
            Remove AI Label
          </AppLink>
          <p className="body-copy">
            A free browser-based tool for checking and cleaning supported AI-related metadata before you post.
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
        {siteBUrl && siteBBrand ? (
          <div>
            <h3>Companion</h3>
            <a href={siteBUrl} className="text-link" target="_blank" rel="noreferrer">
              {siteBBrand}
            </a>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
