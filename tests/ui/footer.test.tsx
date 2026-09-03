import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Footer } from "@/components/layout/Footer";

describe("footer", () => {
  const originalSiteBUrl = process.env.NEXT_PUBLIC_SITE_B_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_B_URL;
  });

  afterEach(() => {
    if (originalSiteBUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_B_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_B_URL = originalSiteBUrl;
    }
  });

  it("does not expose a companion placeholder when Site B is not configured", () => {
    render(<Footer />);

    expect(screen.queryByRole("heading", { name: "Companion" })).not.toBeInTheDocument();
    expect(screen.queryByText(/appears only when the companion site is configured/)).not.toBeInTheDocument();
  });
});
