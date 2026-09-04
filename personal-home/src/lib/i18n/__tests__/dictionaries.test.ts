import { describe, expect, test } from "vitest"

import { en } from "@/lib/i18n/dictionaries/en"
import { es } from "@/lib/i18n/dictionaries/es"

type Leaf = string | ((...args: never[]) => string)

// Walks the catalog and yields "a.b.c" paths with their values, so a failure
// names the exact key rather than dumping the whole object.
function* leaves(value: unknown, path: string[] = []): Generator<[string, Leaf]> {
  if (typeof value === "string" || typeof value === "function") {
    yield [path.join("."), value as Leaf]
    return
  }
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) yield* leaves(item, [...path, String(index)])
    return
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) yield* leaves(item, [...path, key])
  }
}

const EN_LEAVES = [...leaves(en)]
const ES_LEAVES = [...leaves(es)]

describe("string catalogs", () => {
  // Key *presence* is already a compile error, since es is typed as Dictionary.
  // These cover what the type system can't: empty values, and arrays that are
  // shorter in one locale than the other.
  test("every English value is a non-empty string or formatter", () => {
    for (const [path, value] of EN_LEAVES) {
      expect(typeof value === "function" || value.trim().length > 0, path).toBe(true)
    }
  })

  test("every Spanish value is a non-empty string or formatter", () => {
    for (const [path, value] of ES_LEAVES) {
      expect(typeof value === "function" || value.trim().length > 0, path).toBe(true)
    }
  })

  test("both catalogs have the same shape, arrays included", () => {
    expect(ES_LEAVES.map(([path]) => path)).toEqual(EN_LEAVES.map(([path]) => path))
  })

  test("formatters interpolate their argument", () => {
    expect(en.footer.copyright(2026)).toContain("2026")
    expect(es.footer.copyright(2026)).toContain("2026")
    expect(es.legal.lastUpdated("1 de enero de 2026")).toContain("1 de enero de 2026")
    expect(es.terms.governingLaw.body("Nueva York")).toContain("Nueva York")
  })

  test("Spanish avoids the positioning language the brand docs rule out", () => {
    // docs/PROJECT_OVERVIEW.md bars positioning as a "web developer" or
    // "freelancer"; the direct Spanish translations are the easy way to
    // reintroduce it in copy that describes Rickie today.
    const positioning = [
      es.common.siteDescription,
      es.common.jobTitle,
      es.home.tagline,
      es.home.intro,
      es.consulting.intro,
      es.resume.subtitle,
      es.resume.summary,
    ].join(" ").toLowerCase()

    expect(positioning).not.toContain("desarrollador web")
    expect(positioning).not.toContain("freelance")
  })
})
