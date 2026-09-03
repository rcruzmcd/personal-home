import fs from "node:fs"
import path from "node:path"
import type { ReactElement } from "react"

import { SITE_URL } from "@/lib/seo"

// Shared frame for every generated Open Graph image, so the homepage card and
// each case-study card read as the same site. Brand values are inlined rather
// than pulled from Tailwind tokens: ImageResponse renders with Satori, which
// has no access to the stylesheet and only understands inline styles.
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

// Satori ships no bold face and can't read next/font's output, so Inter is
// loaded straight off disk from @fontsource. woff2 is deliberately not used —
// Satori only understands ttf, otf and woff. The path is assembled at runtime
// instead of via require.resolve: Turbopack treats a resolve() call as an
// import and tries to bundle every font file in the package. Every OG route is
// prerendered, so this reads during the build, never on a request.
function interFont(weight: 400 | 700) {
  const file = path.join(
    process.cwd(),
    "node_modules",
    "@fontsource",
    "inter",
    "files",
    `inter-latin-${weight}-normal.woff`
  )

  return {
    name: "Inter",
    data: fs.readFileSync(file),
    weight,
    style: "normal" as const,
  }
}

// Pass as ImageResponse's `fonts` option alongside `size`.
export function ogFonts() {
  return [interFont(400), interFont(700)]
}

const PURPLE = "#5D3A7A"
const GREEN = "#2D7A4A"

// Satori has no text-overflow support, so long descriptions are trimmed at a
// word boundary before layout rather than clipped mid-word by the frame.
function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const clipped = text.slice(0, max)
  const lastSpace = clipped.lastIndexOf(" ")
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`
}

export function OgFrame({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: PURPLE,
        padding: "80px 90px",
        fontFamily: "Inter",
        color: "#FFFFFF",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ width: 120, height: 10, backgroundColor: GREEN, borderRadius: 5 }} />
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
          }}
        >
          {eyebrow}
        </div>
        <div style={{ marginTop: 20, fontSize: 76, fontWeight: 700, lineHeight: 1.15 }}>
          {truncate(title, 70)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 32, lineHeight: 1.4, color: "rgba(255,255,255,0.86)" }}>
          {truncate(description, 150)}
        </div>
        <div style={{ marginTop: 32, fontSize: 26, color: "rgba(255,255,255,0.62)" }}>
          {SITE_URL.replace("https://", "")}
        </div>
      </div>
    </div>
  )
}
