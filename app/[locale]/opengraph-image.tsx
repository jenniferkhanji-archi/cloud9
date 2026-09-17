import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cloud9 — Dreamy Coffee";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const fr = locale === "fr";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FAF8F3 0%, #BED4E5 100%)",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 90,
          width: 240,
          height: 100,
          background: "#FFFFFF",
          borderRadius: 999,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 120,
          width: 280,
          height: 120,
          background: "#FFFFFF",
          borderRadius: 999,
          opacity: 0.45,
        }}
      />
      <div style={{ fontSize: 116, fontWeight: 700, color: "#53443D", letterSpacing: -2 }}>
        cloud9
      </div>
      <div style={{ marginTop: 20, fontSize: 36, fontWeight: 500, color: "#4A5F72" }}>
        {fr ? "Un café tout doux, à Lyon" : "Dreamy coffee in Lyon"}
      </div>
    </div>,
    { ...size }
  );
}
