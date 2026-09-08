import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            background: "#FF5500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
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
