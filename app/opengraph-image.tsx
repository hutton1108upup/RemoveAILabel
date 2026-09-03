import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Remove AI Label";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#FAFAF7",
          color: "#1C1A17",
          padding: "72px",
          fontSize: 56,
          fontWeight: 600,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 28 }}>
          <svg aria-hidden="true" width="88" height="88" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#0D9487" />
            <rect x="7" y="8" width="43" height="44" rx="9" fill="none" stroke="#FFFFFF" strokeWidth="5" />
            <circle cx="19" cy="21" r="4" fill="#FFFFFF" />
            <path d="M11 45 23 32l8 9 7-7 10 11H11Z" fill="#FFFFFF" />
            <circle cx="42" cy="20" r="2.75" fill="#FFFFFF" />
            <circle cx="42" cy="28" r="2.75" fill="#FFFFFF" />
            <circle cx="42" cy="36" r="4" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="2.5 2.5" />
            <path d="M46 36c5 1 8 5 10 9" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="57" cy="50" r="4.5" fill="#FFFFFF" />
          </svg>
          <div style={{ color: "#0D9487", fontSize: 20 }}>Free browser-based image tool</div>
        </div>
        <div>Remove AI Label</div>
        <div style={{ fontSize: 28, fontWeight: 400, marginTop: 20 }}>
          Check and clean supported AI-related metadata before you post.
        </div>
      </div>
    ),
    size,
  );
}
