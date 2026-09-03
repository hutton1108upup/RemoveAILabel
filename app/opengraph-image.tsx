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
        <div style={{ color: "#0D9487", fontSize: 20, marginBottom: 20 }}>Free local image tool</div>
        <div>Remove AI Label</div>
        <div style={{ fontSize: 28, fontWeight: 400, marginTop: 20 }}>
          Check and clean supported AI label metadata before you post.
        </div>
      </div>
    ),
    size,
  );
}
