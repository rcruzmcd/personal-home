import type { Project } from "@/lib/content/types"

export const SITE_URL = "https://rickiecruz.com"
export const SITE_NAME = "Rickie Cruz"
export const SITE_DESCRIPTION =
  "Software engineer building digital products, systems, and experiences."

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "Software Engineer",
    description: SITE_DESCRIPTION,
  }
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function buildProjectJsonLd(project: Project) {
  const url = absoluteUrl(`/${project.category === "work" ? "work" : "projects"}/${project.slug}`)

  return {
    "@context": "https://schema.org",
    "@type": project.category === "work" ? "CreativeWork" : "SoftwareApplication",
    name: project.title,
    description: project.seoDescription ?? project.description,
    url,
    ...(project.heroImage ? { image: absoluteUrl(project.heroImage) } : {}),
  }
}
