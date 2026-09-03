import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/Footer";

describe("footer", () => {
  const originalSiteBUrl = process.env.NEXT_PUBLIC_SITE_B_URL;
  const originalSiteBBrand = process.env.NEXT_PUBLIC_SITE_B_BRAND;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_B_URL;
    delete process.env.NEXT_PUBLIC_SITE_B_BRAND;
  });

  afterEach(() => {
    cleanup();
    if (originalSiteBUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_B_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_B_URL = originalSiteBUrl;
    }
    if (originalSiteBBrand === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_B_BRAND;
    } else {
      process.env.NEXT_PUBLIC_SITE_B_BRAND = originalSiteBBrand;
    }
  });

  it("does not expose a companion placeholder when Site B is not configured", () => {
    render(<Footer />);

    expect(screen.queryByRole("heading", { name: "Companion" })).not.toBeInTheDocument();
    expect(screen.queryByText(/appears only when the companion site is configured/)).not.toBeInTheDocument();
  });

  it("keeps the companion column hidden until a Site B brand is explicitly configured", () => {
    process.env.NEXT_PUBLIC_SITE_B_URL = "https://site-b.example.com";

    render(<Footer />);

    expect(screen.queryByRole("heading", { name: "Companion" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Review visible image artifacts" })).not.toBeInTheDocument();
  });

  it("renders the configured Site B brand as the footer link", () => {
    process.env.NEXT_PUBLIC_SITE_B_URL = "https://site-b.example.com";
    process.env.NEXT_PUBLIC_SITE_B_BRAND = "PixelPolish";

    render(<Footer />);

    const brandLink = screen.getByRole("link", { name: "PixelPolish" });
    expect(brandLink).toHaveAttribute("href", "https://site-b.example.com");
    expect(brandLink).toHaveAttribute("target", "_blank");
    expect(brandLink).toHaveAttribute("rel", "noreferrer");
  });
});
