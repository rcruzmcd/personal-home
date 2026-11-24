import type { Locale } from "@/lib/i18n/locales"
import { listSlugs, readFrontmatterOnly, readFullSource } from "./mdx"
import type { Project, ProjectCategory } from "./types"

// Drafts are visible everywhere except a production build, so `bun dev` is the
// review surface and nothing unfinished ships.
const SHOW_DRAFTS = process.env.NODE_ENV !== "production"

export function isVisible(project: Pick<Project, "draft">, showDrafts = SHOW_DRAFTS): boolean {
  return showDrafts || !project.draft
}

// Every read is locale-scoped. The parameter is required rather than defaulted
// to English so a new call site can't quietly serve English copy on a Spanish
// page — the compiler asks the question instead.
function getProjectsForCategory(category: ProjectCategory, locale: Locale): Project[] {
  return listSlugs(category)
    .map((slug) => readFrontmatterOnly(category, slug, locale))
    .filter((project) => isVisible(project))
}

export function getAllProjects(locale: Locale): Project[] {
  return [
    ...getProjectsForCategory("work", locale),
    ...getProjectsForCategory("project", locale),
  ]
}

export function getWorkProjects(locale: Locale): Project[] {
  return getProjectsForCategory("work", locale)
}

export function getPersonalProjects(locale: Locale): Project[] {
  return getProjectsForCategory("project", locale)
}

export function getFeaturedProjects(locale: Locale, limit = 3): Project[] {
  return getAllProjects(locale)
    .filter((project) => project.featured)
    .sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
    .slice(0, limit)
}

export function getProjectsByTechnology(tech: string, locale: Locale): Project[] {
  return getAllProjects(locale).filter((project) => project.technologies.includes(tech))
}

export function getActiveProjects(locale: Locale): Project[] {
  return getAllProjects(locale).filter((project) => project.status === "active")
}

export function getProject(
  category: ProjectCategory,
  slug: string,
  locale: Locale
): Project | undefined {
  if (!listSlugs(category).includes(slug)) return undefined
  const project = readFrontmatterOnly(category, slug, locale)
  return isVisible(project) ? project : undefined
}

export function getProjectWithContent(
  category: ProjectCategory,
  slug: string,
  locale: Locale
): { project: Project; content: string; isFallback: boolean } | undefined {
  if (!listSlugs(category).includes(slug)) return undefined
  const { data, content, isFallback } = readFullSource(category, slug, locale)
  if (!isVisible(data)) return undefined
  return { project: data, content, isFallback }
}
