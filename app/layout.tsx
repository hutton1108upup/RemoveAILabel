import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { getSiteOrigin } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: "Remove AI Label",
    template: "%s | Remove AI Label",
  },
  description: "Check and clean supported AI-related image metadata in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MicrosoftClarity />
      </body>
    </html>
  );
}
