import { listSlugs, readFrontmatterOnly, readFullSource } from "./mdx"
import type { Project, ProjectCategory } from "./types"

function getProjectsForCategory(category: ProjectCategory): Project[] {
  return listSlugs(category).map((slug) => readFrontmatterOnly(category, slug))
}

export function getAllProjects(): Project[] {
  return [...getProjectsForCategory("work"), ...getProjectsForCategory("project")]
}

export function getWorkProjects(): Project[] {
  return getProjectsForCategory("work")
}

export function getPersonalProjects(): Project[] {
  return getProjectsForCategory("project")
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects()
    .filter((project) => project.featured)
    .sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
    .slice(0, limit)
}

export function getProjectsByTechnology(tech: string): Project[] {
  return getAllProjects().filter((project) => project.technologies.includes(tech))
}

export function getActiveProjects(): Project[] {
  return getAllProjects().filter((project) => project.status === "active")
}

export function getProject(category: ProjectCategory, slug: string): Project | undefined {
  if (!listSlugs(category).includes(slug)) return undefined
  return readFrontmatterOnly(category, slug)
}

export function getProjectWithContent(
  category: ProjectCategory,
  slug: string
): { project: Project; content: string } | undefined {
  if (!listSlugs(category).includes(slug)) return undefined
  const { data, content } = readFullSource(category, slug)
  return { project: data, content }
}
