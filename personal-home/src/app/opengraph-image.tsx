import { ImageResponse } from "next/og"

import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, ogFonts } from "@/lib/og"
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo"

export const alt = `${SITE_NAME} — ${SITE_DESCRIPTION}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function OpengraphImage() {
  return new ImageResponse(
    <OgFrame eyebrow="Software Engineer" title={SITE_NAME} description={SITE_DESCRIPTION} />,
    { ...size, fonts: ogFonts() }
  )
}
