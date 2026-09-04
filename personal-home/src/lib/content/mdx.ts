import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales"
import { ProjectFrontmatterSchema, ProjectTranslationSchema } from "./schema"
import type { Project, ProjectCategory } from "./types"

const CONTENT_ROOT = path.join(process.cwd(), "content")

const CATEGORY_DIRS: Record<ProjectCategory, string> = {
  work: "work",
  project: "projects",
}

function categoryDir(category: ProjectCategory): string {
  return path.join(CONTENT_ROOT, CATEGORY_DIRS[category])
}

export function listSlugs(category: ProjectCategory): string[] {
  const dir = categoryDir(category)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

// The English entry is the canonical document ("index.mdx"); every other locale
// is a sibling overlay ("index.es.mdx").
function entryFile(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "index.mdx" : `index.${locale}.mdx`
}

function entryPath(category: ProjectCategory, slug: string, locale: Locale): string {
  return path.join(categoryDir(category), slug, entryFile(locale))
}

function relativePath(category: ProjectCategory, slug: string, locale: Locale): string {
  return `content/${CATEGORY_DIRS[category]}/${slug}/${entryFile(locale)}`
}

function parseBase(category: ProjectCategory, slug: string) {
  const raw = fs.readFileSync(entryPath(category, slug, DEFAULT_LOCALE), "utf8")
  const { data, content } = matter(raw)
  const result = ProjectFrontmatterSchema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${relativePath(category, slug, DEFAULT_LOCALE)}: ${result.error.message}`
    )
  }
  return { data: result.data, content }
}

function parseTranslation(category: ProjectCategory, slug: string, locale: Locale) {
  const file = entryPath(category, slug, locale)
  // A missing translation is a normal state, not an error: entries are written
  // in English first, and the caller falls back rather than 404ing.
  if (!fs.existsSync(file)) return null

  const { data, content } = matter(fs.readFileSync(file, "utf8"))
  const result = ProjectTranslationSchema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${relativePath(category, slug, locale)}: ${result.error.message}`
    )
  }
  return { data: result.data, content }
}

// Overlay wins key by key; arrays replace wholesale rather than merging
// element-wise, because a translator rewrites a whole list rather than editing
// it in place. `links` is the one exception — its url and type are
// locale-invariant, so only the label is taken from the translation.
function merge(base: Project, translation: NonNullable<ReturnType<typeof parseTranslation>>["data"]): Project {
  const { links, casestudy, personalProject, ...scalars } = translation

  return {
    ...base,
    ...scalars,
    links: links
      ? base.links.map((link, index) => ({ ...link, ...(links[index] ?? {}) }))
      : base.links,
    casestudy: base.casestudy ? { ...base.casestudy, ...casestudy } : base.casestudy,
    personalProject: base.personalProject
      ? { ...base.personalProject, ...personalProject }
      : base.personalProject,
  }
}

export function readFrontmatterOnly(
  category: ProjectCategory,
  slug: string,
  locale: Locale
): Project {
  const base = parseBase(category, slug)
  if (locale === DEFAULT_LOCALE) return base.data

  const translation = parseTranslation(category, slug, locale)
  return translation ? merge(base.data, translation.data) : base.data
}

export type ProjectSource = {
  data: Project
  content: string
  /**
   * True when this locale has no translation and the English document is being
   * served in its place. The page surfaces a notice and canonicalizes to the
   * English URL rather than presenting untranslated prose as a Spanish page.
   */
  isFallback: boolean
}

export function readFullSource(
  category: ProjectCategory,
  slug: string,
  locale: Locale
): ProjectSource {
  const base = parseBase(category, slug)
  if (locale === DEFAULT_LOCALE) {
    return { data: base.data, content: base.content, isFallback: false }
  }

  const translation = parseTranslation(category, slug, locale)
  if (!translation) {
    return { data: base.data, content: base.content, isFallback: true }
  }

  return {
    data: merge(base.data, translation.data),
    // A translation file may translate the frontmatter but leave the (much
    // shorter) MDX body empty; fall back to the English body in that case.
    content: translation.content.trim() ? translation.content : base.content,
    isFallback: false,
  }
}

export function hasTranslation(
  category: ProjectCategory,
  slug: string,
  locale: Locale
): boolean {
  return locale === DEFAULT_LOCALE || fs.existsSync(entryPath(category, slug, locale))
}
