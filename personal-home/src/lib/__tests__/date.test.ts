import { describe, expect, test } from "vitest"

import { formatDate, lastModified } from "@/lib/date"

describe("formatDate", () => {
  test("formats a date-only ISO string for display", () => {
    expect(formatDate("2026-09-01", "en")).toBe("September 1, 2026")
  })

  test("formats in Spanish for the es locale", () => {
    expect(formatDate("2026-09-01", "es")).toBe("1 de septiembre de 2026")
  })

  // `new Date("2026-09-01")` is UTC midnight; formatted in a US local zone it
  // would render as August 31. The formatter pins to UTC to prevent that.
  test("does not shift the day in zones west of UTC", () => {
    expect(formatDate("2026-01-01", "en")).toBe("January 1, 2026")
    expect(formatDate("2026-01-01", "es")).toBe("1 de enero de 2026")
  })
})

describe("lastModified", () => {
  test("prefers the revision date", () => {
    expect(
      lastModified({ publishedDate: "2026-08-31", updatedDate: "2026-09-01" })
    ).toBe("2026-09-01")
  })

  test("falls back to the publication date when never revised", () => {
    expect(lastModified({ publishedDate: "2026-08-31" })).toBe("2026-08-31")
  })
})
