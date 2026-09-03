import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

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
});
