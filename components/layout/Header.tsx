"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandSymbol } from "@/components/brand/BrandSymbol";
import { headerNavigation } from "@/content/navigation";
import { AppLink } from "./AppLink";

export function Header() {
  const [mobile, setMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.("change", update);
    return () => mediaQuery.removeEventListener?.("change", update);
  }, []);

  return (
    <header className="site-header" data-home-section="header">
      <div className="shell site-header-inner">
        <AppLink href="/" className="brand-mark">
          <BrandSymbol className="brand-symbol" />
          Remove AI Label
        </AppLink>
        {mobile ? (
          <details className="mobile-nav" open={menuOpen} onToggle={(event) => setMenuOpen(event.currentTarget.open)}>
            <summary
              className="button button-secondary mobile-nav-trigger"
              aria-label="Open navigation menu"
              role="button"
            >
              <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            </summary>
            {menuOpen ? (
              <nav aria-label="Primary" className="mobile-nav-panel">
                {headerNavigation.map((item) => (
                  <AppLink key={item.href} href={item.href}>
                    {item.label}
                  </AppLink>
                ))}
                <AppLink href="/#use-free-tool" className="button button-primary">
                  Check a File
                </AppLink>
              </nav>
            ) : null}
          </details>
        ) : (
          <nav aria-label="Primary" className="site-nav">
            {headerNavigation.map((item) => (
              <AppLink key={item.href} href={item.href}>
                {item.label}
              </AppLink>
            ))}
            <AppLink href="/#use-free-tool" className="button button-primary">
              Check a File
            </AppLink>
          </nav>
        )}
      </div>
    </header>
  );
}
