import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sociolab — Trend-native GTM team";

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
          background: "#0d0d0d",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "8px",
              background: "#ff4d00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
          <div style={{ fontSize: "72px", fontWeight: 700, lineHeight: 1.05 }}>
            The internet moves fast.
          </div>
          <div style={{ fontSize: "72px", fontWeight: 700, lineHeight: 1.05, color: "#ff4d00" }}>
            Your brand should too.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: "26px", color: "#ffffff99" }}>
          {site.tagline} — from trend to WhatsApp
        </div>
      </div>
    ),
    size,
  );
}