import type { MetadataRoute } from "next"

import { getAllProjects } from "@/lib/content/projects"
import { hasTranslation } from "@/lib/content/mdx"
import { lastModified } from "@/lib/date"
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/locales"
import { localizeHref } from "@/lib/i18n/routing"
import { absoluteUrl, projectPath } from "@/lib/seo"

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.8 },
  { path: "/consulting", changeFrequency: "monthly", priority: 0.7 },
  { path: "/resume", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
] as const

// Google wants each URL in the sitemap to advertise its own alternates, so a
// path is listed once per locale and every listing carries the full set.
function alternates(path: string, locales: readonly Locale[]) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, absoluteUrl(localizeHref(path, locale))])
    ),
  }
}

function entriesForPath(
  path: string,
  locales: readonly Locale[],
  rest: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: absoluteUrl(localizeHref(path, locale)),
    alternates: alternates(path, locales),
    ...rest,
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries = STATIC_ROUTES.flatMap((route) =>
    entriesForPath(route.path, LOCALES, {
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  )

  // Only translated entries get a Spanish URL here. An untranslated one still
  // renders (behind a notice) but canonicalizes to English, so advertising it
  // as a separate page would contradict its own canonical tag.
  const projectEntries = getAllProjects(DEFAULT_LOCALE).flatMap((project) => {
    const locales = LOCALES.filter(
      (locale) => locale === DEFAULT_LOCALE || hasTranslation(project.category, project.slug, locale)
    )

    return entriesForPath(projectPath(project), locales, {
      lastModified: new Date(lastModified(project)),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  })

  return [...staticEntries, ...projectEntries]
}
