import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F172A",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "24px",
            background: "#FF5500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "72px",
            fontWeight: 800,
            color: "#0F172A",
            fontFamily: "sans-serif",
          }}
        >
          S
        </div>
      </div>
    ),
    size,
  );
}
