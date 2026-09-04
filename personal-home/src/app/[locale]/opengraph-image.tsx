import { ImageResponse } from "next/og"

import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, ogFonts } from "@/lib/og"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { DEFAULT_LOCALE, LOCALES, assertLocale, isLocale } from "@/lib/i18n/locales"
import { SITE_NAME } from "@/lib/seo"

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Unlike the image renderer, `params` here is a plain object and is absent
// during page-data collection, so fall back to the default locale rather than
// throwing — this only decides the alt text.
export async function generateImageMetadata({
  params,
}: {
  params?: { locale?: string }
}) {
  const locale = isLocale(params?.locale) ? params.locale : DEFAULT_LOCALE
  const t = await getDictionary(locale)
  return [
    { id: 0, size, contentType, alt: `${SITE_NAME} — ${t.common.siteDescription}` },
  ]
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getDictionary(assertLocale(locale))

  return new ImageResponse(
    <OgFrame
      eyebrow={t.common.jobTitle}
      title={SITE_NAME}
      description={t.common.siteDescription}
    />,
    { ...size, fonts: ogFonts() }
  )
}
