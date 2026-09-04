import type { Metadata } from "next"

import type { Project, ProjectCategory } from "@/lib/content/types"
import { SOCIAL_LINKS } from "@/lib/nav"
import { lastModified } from "@/lib/date"
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/locales"
import { localizeHref } from "@/lib/i18n/routing"

export const SITE_URL = "https://rickiecruz.com"
export const SITE_NAME = "Rickie Cruz"

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}

// The route segment a category lives under. Previously inlined as the same
// `category === "work" ? …` ternary in four places (sitemap, seo, the case
// study header and the resume's project list), which is three chances for them
// to disagree about a URL.
export function projectHref(category: ProjectCategory): string {
  return category === "work" ? "/work" : "/projects"
}

export function projectPath(project: Pick<Project, "category" | "slug">): string {
  return `${projectHref(project.category)}/${project.slug}`
}

/**
 * Canonical URL plus the hreflang set for one locale-independent path.
 *
 * `hreflang` values stay region-neutral ("es", not "es-419"): the copy is
 * written in a neutral Latin American register and shouldn't be scoped to a
 * single country. x-default points at English, which is the unprefixed site.
 */
export function buildAlternates(path: string, locale: Locale): Metadata["alternates"] {
  const languages = Object.fromEntries(
    LOCALES.map((candidate) => [candidate, absoluteUrl(localizeHref(path, candidate))])
  )

  return {
    canonical: absoluteUrl(localizeHref(path, locale)),
    languages: {
      ...languages,
      "x-default": absoluteUrl(localizeHref(path, DEFAULT_LOCALE)),
    },
  }
}

export function buildPersonJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: absoluteUrl(localizeHref("/", locale)),
    jobTitle: "Software Engineer",
    description,
    inLanguage: locale,
    // sameAs is how search engines tie this Person to the same individual on
    // other platforms; it stays in sync with the footer's profile links.
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  }
}

export function buildWebsiteJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(localizeHref("/", locale)),
    description,
    inLanguage: locale,
  }
}

export function buildProjectJsonLd(project: Project, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": project.category === "work" ? "CreativeWork" : "SoftwareApplication",
    name: project.title,
    description: project.seoDescription ?? project.description,
    url: absoluteUrl(localizeHref(projectPath(project), locale)),
    datePublished: project.publishedDate,
    dateModified: lastModified(project),
    inLanguage: locale,
    ...(project.heroImage ? { image: absoluteUrl(project.heroImage) } : {}),
  }
}
