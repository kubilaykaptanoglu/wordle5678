import { ImageResponse } from "next/og"

export const alt = "Kelime5678, 5 6 7 ve 8 harfli günlük kelime oyunu"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#efe6d6",
          color: "#1c1712",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#9c2f2f",
            color: "#efe6d6",
            fontSize: 28,
            letterSpacing: 3,
            padding: "10px 16px",
          }}
        >
          KELIME5678
        </div>
        <div style={{ display: "flex", fontSize: 132, fontWeight: 700, letterSpacing: 8 }}>
          5 6 7 8
        </div>
      </div>
    ),
    { ...size },
  )
}
