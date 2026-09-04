import { describe, expect, test } from "vitest"

import { ProjectFrontmatterSchema } from "@/lib/content/schema"
import {
  getActiveProjects,
  getFeaturedProjects,
  getPersonalProjects,
  getProject,
  getProjectWithContent,
  getProjectsByTechnology,
  getWorkProjects,
} from "@/lib/content/projects"

describe("ProjectFrontmatterSchema", () => {
  test("accepts a well-formed frontmatter object", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      id: "example",
      title: "Example",
      slug: "example",
      description: "An example project.",
      category: "project",
      status: "active",
      startDate: "2026-01-01",
      publishedDate: "2026-01-02",
      technologies: ["Next.js"],
    })
    expect(result.success).toBe(true)
  })

  test("rejects a full ISO timestamp for startDate (date-only expected)", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      id: "example",
      title: "Example",
      slug: "example",
      description: "An example project.",
      category: "project",
      status: "active",
      startDate: "2026-01-01T00:00:00.000Z",
      publishedDate: "2026-01-02",
      technologies: ["Next.js"],
    })
    expect(result.success).toBe(false)
  })

  test("rejects a missing required field", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      id: "example",
      title: "Example",
      slug: "example",
      category: "project",
      status: "active",
      startDate: "2026-01-01",
      publishedDate: "2026-01-02",
      technologies: ["Next.js"],
    })
    expect(result.success).toBe(false)
  })
})

describe("content pipeline (reads content/ from the repo)", () => {
  test("getWorkProjects returns the Chatter Snow case study", () => {
    const work = getWorkProjects("en")
    expect(work.map((p) => p.slug)).toContain("chatter-snow")
  })

  test("getPersonalProjects returns Personal Finance OS", () => {
    const projects = getPersonalProjects("en")
    expect(projects.map((p) => p.slug)).toContain("personal-finance-os")
  })

  test("getProject resolves a single work project by category and slug", () => {
    const project = getProject("work", "chatter-snow", "en")
    expect(project?.title).toBe("Chatter Snow")
    expect(project?.casestudy?.decisions.length).toBeGreaterThan(0)
  })

  test("getProject returns undefined for an unknown slug", () => {
    expect(getProject("work", "does-not-exist", "en")).toBeUndefined()
  })

  test("getProjectWithContent returns the parsed MDX body alongside the project", () => {
    const result = getProjectWithContent("project", "personal-finance-os", "en")
    expect(result?.project.title).toBe("Personal Finance OS")
    expect(result?.content).toContain("Future enhancements")
  })

  test("getFeaturedProjects returns only featured projects", () => {
    const featured = getFeaturedProjects("en")
    expect(featured.length).toBeGreaterThan(0)
    expect(featured.every((p) => p.featured)).toBe(true)
  })

  test("getActiveProjects returns only active-status projects", () => {
    const active = getActiveProjects("en")
    expect(active.every((p) => p.status === "active")).toBe(true)
  })

  test("getProjectsByTechnology filters by an exact technology tag", () => {
    const nextProjects = getProjectsByTechnology("Next.js", "en")
    expect(nextProjects.length).toBeGreaterThanOrEqual(2)
  })
})
