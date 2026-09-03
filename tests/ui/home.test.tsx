import fs from "node:fs";
import path from "node:path";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { metadata } from "@/app/page";

afterEach(() => {
  cleanup();
});

describe("home page shell", () => {
  it("renders the selected Precision Clean symbol in the accessible brand link", () => {
    render(<HomePage />);

    const header = screen.getByRole("banner");
    const brandLink = within(header).getByRole("link", { name: "Remove AI Label" });
    const brandSymbol = brandLink.querySelector("[data-brand-symbol='precision-clean']");

    expect(brandSymbol).toBeInTheDocument();
    expect(brandSymbol).toHaveAttribute("aria-hidden", "true");
  });

  it("imports the root design tokens at the top of globals.css", () => {
    const globalsPath = path.resolve(process.cwd(), "app/globals.css");
    const globalsCss = fs.readFileSync(globalsPath, "utf8");

    expect(globalsCss.startsWith("@import '../tokens.css';")).toBe(true);
  });

  it("renders the 12 required homepage sections and only one navy section", () => {
    const { container } = render(<HomePage />);
    const main = screen.getByRole("main");
    const tool = screen.getByRole("region", { name: "Remove AI label tool" });

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Check and Remove AI Label Metadata Before You Post",
      }),
    ).toBeInTheDocument();

    const sections = container.querySelectorAll("[data-home-section]");
    expect(sections).toHaveLength(12);

    expect(
      within(main).getByRole("heading", { level: 2, name: "What the Remove AI Label Tool Checks" }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", { level: 2, name: "What It Preserves" }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", { level: 2, name: "What It Cannot Guarantee" }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", { level: 2, name: "How to Remove AI Label Metadata from an Image" }),
    ).toBeInTheDocument();
    expect(within(main).getByRole("heading", { level: 2, name: "FAQ" })).toBeInTheDocument();

    expect(container.querySelectorAll("[data-surface='navy']")).toHaveLength(1);
    expect(screen.queryByText("Uploading")).not.toBeInTheDocument();
    expect(tool).toHaveAttribute("data-clarity-mask", "true");
  });

  it("keeps the homepage focused on the Remove AI Label search intent", () => {
    const { container } = render(<HomePage />);
    const main = screen.getByRole("main");
    const words = main.textContent?.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g) ?? [];

    expect(metadata.title).toBe("Remove AI Label from Images — Free & Private Tool");
    expect(metadata.description).toBe(
      "Check and remove supported C2PA, XMP and AI label metadata from JPG and PNG images locally in your browser. Free, private and no account.",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "What the Remove AI Label Tool Checks" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "How to Remove AI Label Metadata from an Image" }),
    ).toBeInTheDocument();
    expect(words.length).toBeGreaterThanOrEqual(1200);
    expect(words.length).toBeLessThanOrEqual(1800);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("renders a static example verification report and a complete final CTA", () => {
    const { container } = render(<HomePage />);
    const report = screen.getByRole("heading", { name: "Example verification report" }).closest("article");
    if (!report) {
      throw new Error("expected example report card");
    }

    expect(screen.getAllByText("Example verification report").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("columnheader", { name: "Item" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("columnheader", { name: "Before" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("columnheader", { name: "Clean copy" }).length).toBeGreaterThan(0);
    expect(within(report).getByRole("link", { name: "Download example report" })).toHaveAttribute(
      "href",
      "/example-report.txt",
    );
    expect(within(report).queryByRole("button", { name: "Download example report" })).not.toBeInTheDocument();

    expect(screen.getAllByRole("heading", { level: 2, name: "Check a File Before You Post" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Check a File" }).some((link) => link.getAttribute("href") === "/#use-free-tool")).toBe(true);
    expect(screen.getAllByText("No account · No image upload · Original stays unchanged").length).toBeGreaterThan(0);
    expect(screen.queryByText("Works offline")).not.toBeInTheDocument();
    expect(screen.getAllByText("Meta labeling approach").length).toBeGreaterThan(0);
    expect(screen.getByText("No re-encoding")).toBeInTheDocument();
    expect(screen.queryByText(/Visible artifact guidance appears only when/)).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-home-evidence-link]")).toHaveLength(5);
    expect(container.querySelectorAll(".preserve-list svg")).toHaveLength(6);
    expect(container.querySelectorAll(".faq-chevron").length).toBeGreaterThan(0);
  });
});
