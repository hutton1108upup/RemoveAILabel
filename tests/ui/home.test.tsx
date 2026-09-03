import fs from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("home page shell", () => {
  it("imports the root design tokens at the top of globals.css", () => {
    const globalsPath = path.resolve(process.cwd(), "app/globals.css");
    const globalsCss = fs.readFileSync(globalsPath, "utf8");

    expect(globalsCss.startsWith("@import '../tokens.css';")).toBe(true);
  });

  it("renders the 12 required homepage sections and only one navy section", () => {
    const { container } = render(<HomePage />);
    const main = screen.getByRole("main");

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
      within(main).getByRole("heading", { level: 2, name: "What This Tool Checks" }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", { level: 2, name: "What It Preserves" }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", { level: 2, name: "What It Cannot Guarantee" }),
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", { level: 2, name: "How It Works" }),
    ).toBeInTheDocument();
    expect(within(main).getByRole("heading", { level: 2, name: "FAQ" })).toBeInTheDocument();

    expect(container.querySelectorAll("[data-surface='navy']")).toHaveLength(1);
    expect(screen.queryByText("Uploading")).not.toBeInTheDocument();
  });

  it("renders a static example verification report and a complete final CTA", () => {
    render(<HomePage />);

    expect(screen.getAllByText("Example verification report").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("columnheader", { name: "Item" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("columnheader", { name: "Before" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("columnheader", { name: "Clean copy" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Download example report" }).every((button) => button.hasAttribute("disabled"))).toBe(true);

    expect(screen.getAllByRole("heading", { level: 2, name: "Use the Free Tool Before You Post" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Use Free Tool" }).some((link) => link.getAttribute("href") === "/#use-free-tool")).toBe(true);
    expect(screen.getAllByText("No sign-up · No upload · Works offline").length).toBeGreaterThan(0);
  });
});
