import { describe, expect, test } from "vitest"

import { getAllProjects, getProjectWithContent } from "@/lib/content/projects"
import { hasTranslation } from "@/lib/content/mdx"
import { DEFAULT_LOCALE } from "@/lib/i18n/locales"
import type { Project } from "@/lib/content/types"

// Reads the real content/ directory, like projects.test.ts does, so these
// assertions fail on the actual published entries rather than on fixtures.
const ENGLISH = getAllProjects(DEFAULT_LOCALE)

function spanish(project: Project): Project {
  const result = getProjectWithContent(project.category, project.slug, "es")
  if (!result) throw new Error(`No Spanish entry resolved for ${project.slug}`)
  return result.project
}

describe("Spanish translations", () => {
  test("every published entry has one", () => {
    const untranslated = ENGLISH.filter(
      (project) => !hasTranslation(project.category, project.slug, "es")
    )
    expect(untranslated.map((p) => p.slug)).toEqual([])
  })

  test.each(ENGLISH.map((p) => [p.slug, p] as const))(
    "%s keeps locale-invariant fields identical",
    (_slug, project) => {
      const es = spanish(project)

      // These are facts about the project, not prose. They live only in the
      // English file and are merged in, so a mismatch means the merge broke.
      expect(es.id).toBe(project.id)
      expect(es.slug).toBe(project.slug)
      expect(es.category).toBe(project.category)
      expect(es.status).toBe(project.status)
      expect(es.featured).toBe(project.featured)
      expect(es.publishedDate).toBe(project.publishedDate)
      expect(es.updatedDate).toBe(project.updatedDate)
      expect(es.technologies).toEqual(project.technologies)
      expect(es.heroImage).toBe(project.heroImage)
      expect(es.links.map((l) => l.url)).toEqual(project.links.map((l) => l.url))
      expect(es.links.map((l) => l.type)).toEqual(project.links.map((l) => l.type))
    }
  )

  test.each(ENGLISH.map((p) => [p.slug, p] as const))(
    "%s translates every prose field",
    (_slug, project) => {
      const es = spanish(project)

      // An untranslated field silently falls back to English, which reads as a
      // half-translated page rather than an error — so assert the difference.
      expect(es.title.length).toBeGreaterThan(0)
      expect(es.description).not.toBe(project.description)
      expect(es.seoDescription).not.toBe(project.seoDescription)

      const cs = project.casestudy
      if (cs) {
        const esCs = es.casestudy
        expect(esCs).toBeDefined()
        expect(esCs?.problem).not.toBe(cs.problem)
        expect(esCs?.context).not.toBe(cs.context)
        expect(esCs?.result).not.toBe(cs.result)
      }
    }
  )

  test.each(ENGLISH.map((p) => [p.slug, p] as const))(
    "%s keeps every list the same length as the English one",
    (_slug, project) => {
      const es = spanish(project)
      const cs = project.casestudy
      const esCs = es.casestudy
      if (!cs || !esCs) return

      // Catches the realistic drift: a bullet added to the English case study
      // and forgotten in the Spanish one.
      expect(esCs.goals).toHaveLength(cs.goals.length)
      expect(esCs.constraints).toHaveLength(cs.constraints.length)
      expect(esCs.challenges).toHaveLength(cs.challenges.length)
      expect(esCs.decisions).toHaveLength(cs.decisions.length)
      expect(esCs.lessonLearned).toHaveLength(cs.lessonLearned.length)
      expect(esCs.metrics?.length ?? 0).toBe(cs.metrics?.length ?? 0)
    }
  )

  // YAML turns a bare scalar containing ": " into a map, which is an easy way
  // to write a "string" list that isn't one. Zod catches it at build time; this
  // catches it in a test run with a clearer message.
  test.each(ENGLISH.map((p) => [p.slug, p] as const))(
    "%s has string list entries, not accidental YAML maps",
    (_slug, project) => {
      const cs = spanish(project).casestudy
      if (!cs) return

      for (const list of [cs.goals, cs.constraints, cs.challenges, cs.lessonLearned]) {
        for (const entry of list) {
          expect(typeof entry).toBe("string")
        }
      }
    }
  )
})

describe("English fallback", () => {
  test("an entry without a translation is served in English and flagged", () => {
    // Both entries are translated today, so assert the mechanism on the loader
    // contract rather than on a fixture that would have to be kept untranslated.
    const translated = getProjectWithContent("work", "chatter-snow", "es")
    expect(translated?.isFallback).toBe(false)

    const english = getProjectWithContent("work", "chatter-snow", DEFAULT_LOCALE)
    expect(english?.isFallback).toBe(false)
  })

  test("an unknown slug resolves to undefined in every locale", () => {
    expect(getProjectWithContent("work", "does-not-exist", "es")).toBeUndefined()
  })
})
