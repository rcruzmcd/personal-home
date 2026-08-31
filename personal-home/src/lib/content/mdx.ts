import fs from "node:fs"
import path from "node:path"

import matter from "gray-matter"

import { ProjectFrontmatterSchema } from "./schema"
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

function entryPath(category: ProjectCategory, slug: string): string {
  return path.join(categoryDir(category), slug, "index.mdx")
}

function readRawSource(category: ProjectCategory, slug: string): string {
  return fs.readFileSync(entryPath(category, slug), "utf8")
}

function parseFrontmatter(raw: string, category: ProjectCategory, slug: string) {
  const { data, content } = matter(raw)
  const result = ProjectFrontmatterSchema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in content/${CATEGORY_DIRS[category]}/${slug}/index.mdx: ${result.error.message}`
    )
  }
  return { data: result.data, content }
}

export function readFrontmatterOnly(category: ProjectCategory, slug: string): Project {
  return parseFrontmatter(readRawSource(category, slug), category, slug).data
}

export function readFullSource(
  category: ProjectCategory,
  slug: string
): { data: Project; content: string } {
  return parseFrontmatter(readRawSource(category, slug), category, slug)
}
