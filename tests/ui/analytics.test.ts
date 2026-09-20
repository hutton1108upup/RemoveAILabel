import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { trackAnalyticsEvent } from "@/lib/analytics/events";

afterEach(() => {
  Reflect.deleteProperty(window, "clarity");
});

describe("Microsoft Clarity integration", () => {
  it("loads the configured project globally after hydration in no-cookie mode", () => {
    const layoutSource = fs.readFileSync(path.resolve(process.cwd(), "app/layout.tsx"), "utf8");
    const componentPath = path.resolve(
      process.cwd(),
      "components/analytics/MicrosoftClarity.tsx",
    );

    expect(fs.existsSync(componentPath)).toBe(true);

    const componentSource = fs.readFileSync(componentPath, "utf8");

    expect(layoutSource).toContain(
      'import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";',
    );
    expect(layoutSource).toContain("<MicrosoftClarity />");
    expect(componentSource).toContain('strategy="afterInteractive"');
    expect(componentSource).toContain('"ycmyc2udus"');
    expect(componentSource).toContain('"https://www.clarity.ms/tag/"');
    expect(componentSource).toContain('c[a]("consentv2"');
    expect(componentSource).toContain('analytics_Storage:"denied"');
    expect(componentSource).toContain('ad_Storage:"denied"');
  });

  it("sends only fixed funnel event names and drops the internal payload", () => {
    const clarity = vi.fn();
    Object.defineProperty(window, "clarity", {
      configurable: true,
      value: clarity,
    });

    trackAnalyticsEvent("files_selected", { result: "private-local-detail" });

    expect(clarity).toHaveBeenCalledTimes(1);
    expect(clarity).toHaveBeenCalledWith("event", "files_selected");
    expect(JSON.stringify(clarity.mock.calls)).not.toContain("private-local-detail");
  });

  it("does not fail when Clarity is unavailable", () => {
    expect(() => trackAnalyticsEvent("file_picker_opened")).not.toThrow();
  });
});
