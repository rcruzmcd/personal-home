import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"

import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, ogFonts } from "@/lib/og"
import { getPersonalProjects, getProject } from "@/lib/content/projects"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { DEFAULT_LOCALE, LOCALES, assertLocale, isLocale } from "@/lib/i18n/locales"

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getPersonalProjects(locale).map((project) => ({ locale, slug: project.slug }))
  )
}

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// `params` is a plain object here and is absent during page-data collection,
// so the locale is resolved defensively — it only decides the alt text.
export async function generateImageMetadata({
  params,
}: {
  params?: { locale?: string; slug?: string }
}) {
  const locale = isLocale(params?.locale) ? params.locale : DEFAULT_LOCALE
  const t = await getDictionary(locale)
  return [{ id: 0, size, contentType, alt: t.caseStudy.ogAlt }]
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale = assertLocale(rawLocale)
  const project = getProject("project", slug, locale)
  if (!project) notFound()

  const t = await getDictionary(locale)

  return new ImageResponse(
    <OgFrame
      eyebrow={t.projects.title}
      title={project.title}
      description={project.description}
    />,
    { ...size, fonts: ogFonts() }
  )
}
