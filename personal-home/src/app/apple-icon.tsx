import { ImageResponse } from "next/og"

import { ogFonts } from "@/lib/og"

// iOS home-screen icon. Generated rather than checked in as a PNG so it stays
// in lockstep with icon.svg — same mark, same brand purple, one place to edit.
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

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
          backgroundColor: "#5D3A7A",
          color: "#FFFFFF",
          fontFamily: "Inter",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        RC
      </div>
    ),
    { ...size, fonts: ogFonts() }
  )
}
