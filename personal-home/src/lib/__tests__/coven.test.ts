import { describe, expect, test } from "vitest"

import {
  BUSINESS_MODULES,
  COVEN_MODULES,
  COVEN_PLANS,
  COVEN_SECTION_LINKS,
  NONPROFIT_MODULES,
} from "@/lib/coven"
import { en } from "@/lib/i18n/dictionaries/en"
import { es } from "@/lib/i18n/dictionaries/es"
import { isLinkActive, NAV_LINKS } from "@/lib/nav"

const CATALOGS = { en, es }

describe("Coven section structure", () => {
  // Key presence is a compile error, but ordering and membership are not — a
  // module could be dropped from a list and still type-check.
  test("the modules page shows every module", () => {
    expect([...NONPROFIT_MODULES].sort()).toEqual([...COVEN_MODULES].sort())
  })

  // The moat, and the one deliberate asymmetry in the section: governance is
  // dropped from the business path rather than restated as "advisory board
  // minutes".
  test("the business path omits governance and nothing else", () => {
    expect(BUSINESS_MODULES).not.toContain("governance")
    expect([...BUSINESS_MODULES].sort()).toEqual(
      COVEN_MODULES.filter((id) => id !== "governance")
        .slice()
        .sort()
    )
  })

  test("each audience leads with what that audience came for", () => {
    expect(NONPROFIT_MODULES[0]).toBe("governance")
    expect(BUSINESS_MODULES[0]).toBe("finance")
  })

  test.each(Object.entries(CATALOGS))("%s labels every section link and plan", (_name, t) => {
    for (const link of COVEN_SECTION_LINKS) expect(t.coven.nav[link.key]).toBeTruthy()
    for (const plan of COVEN_PLANS) expect(t.coven.pricing.plans[plan].price).toBeTruthy()
  })

  test.each(Object.entries(CATALOGS))("%s carries no business copy for governance", (_name, t) => {
    expect("governance" in t.coven.business.modules).toBe(false)
  })

  // Pricing shows numbers rather than a contact-sales gate.
  test.each(Object.entries(CATALOGS))("%s pricing states a figure per plan", (_name, t) => {
    for (const plan of COVEN_PLANS) {
      expect(t.coven.pricing.plans[plan].price).toMatch(/\d/)
    }
  })

  // Coven is kept out of the primary nav while it waits to move to its own
  // site; the active-link rule still has to hold for when it is linked again.
  test("Coven is absent from the primary nav, but its pages still match it", () => {
    const hrefs: readonly string[] = NAV_LINKS.map((link) => link.href)
    expect(hrefs).not.toContain("/coven")
    expect(isLinkActive("/coven/pricing", "/coven")).toBe(true)
    expect(isLinkActive("/es/coven/pricing", "/coven")).toBe(true)
    expect(isLinkActive("/consulting", "/coven")).toBe(false)
  })
})
