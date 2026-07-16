import { ImageResponse } from "next/og";

export const alt = "ServeLocal — verified community service for students";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#175c41",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Dark-band wordmark treatment from v1's footer: white "Serve" + --green-mid "Local". */}
        <div style={{ display: "flex", fontSize: 132, fontWeight: 700, letterSpacing: -2 }}>
          <span style={{ color: "#ffffff" }}>Serve</span>
          <span style={{ color: "#bcdac9" }}>Local</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#ffffff" }}>
          Verified community service for students — free forever.
        </div>
      </div>
    ),
    size,
  );
}
