import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sociolab — Full-Funnel Paid Media & Direct-Response Creative Studio";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F172A",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "12px",
              background: "#FF5500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            S
          </div>
          <div style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Sociolab
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "960px" }}>
          <div style={{ fontSize: "64px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Full-Funnel Paid Media
          </div>
          <div style={{ fontSize: "64px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#FF5500" }}>
            & Direct-Response Creative
          </div>
        </div>
        <div style={{ display: "flex", fontSize: "24px", color: "#94A3B8" }}>
          sociolab.com.pk — Scale your brand with data-driven ads and high-converting creative
        </div>
      </div>
    ),
    size,
  );
}
