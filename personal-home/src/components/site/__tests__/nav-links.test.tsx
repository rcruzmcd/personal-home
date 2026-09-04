import { screen } from "@testing-library/react"
import { beforeEach, expect, test, vi } from "vitest"

import { NavLinks } from "@/components/site/nav-links"
import { renderWithI18n } from "@/test/i18n"

const pathname = vi.hoisted(() => ({ current: "/" }))
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }))

beforeEach(() => {
  pathname.current = "/"
})

test("prefixes every nav link with the active locale", () => {
  pathname.current = "/es"
  renderWithI18n(<NavLinks />, { locale: "es" })

  expect(screen.getByRole("link", { name: "Trabajo" })).toHaveAttribute("href", "/es/work")
  expect(screen.getByRole("link", { name: "Consultoría" })).toHaveAttribute(
    "href",
    "/es/consulting"
  )
})

test("leaves English links unprefixed", () => {
  renderWithI18n(<NavLinks />)

  expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/work")
})

// The active check compares locale-independent paths, so a Spanish URL has to
// highlight the same link its English counterpart does.
test("marks the current section active under a locale prefix", () => {
  pathname.current = "/es/work/chatter-snow"
  renderWithI18n(<NavLinks />, { locale: "es" })

  expect(screen.getByRole("link", { name: "Trabajo" })).toHaveAttribute(
    "aria-current",
    "page"
  )
  expect(screen.getByRole("link", { name: "Proyectos" })).not.toHaveAttribute("aria-current")
})
