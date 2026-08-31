import type { MetadataRoute } from "next"

import { getAllProjects } from "@/lib/content/projects"
import { SITE_URL } from "@/lib/seo"

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const projectEntries: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: `${SITE_URL}/${project.category === "work" ? "work" : "projects"}/${project.slug}`,
    lastModified: new Date(project.publishedDate),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticEntries, ...projectEntries]
}
