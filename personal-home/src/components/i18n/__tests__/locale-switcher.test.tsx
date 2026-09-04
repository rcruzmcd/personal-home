import { screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import userEvent from "@testing-library/user-event"

import { LocaleSwitcher } from "@/components/i18n/locale-switcher"
import { renderWithI18n } from "@/test/i18n"

const pathname = vi.hoisted(() => ({ current: "/" }))
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }))

beforeEach(() => {
  pathname.current = "/"
})

afterEach(() => {
  // Expire the cookie so one test's click can't leak into the next.
  document.cookie = "NEXT_LOCALE=;path=/;max-age=0"
})

test("keeps the visitor on the same page when switching language", () => {
  pathname.current = "/work/chatter-snow"
  renderWithI18n(<LocaleSwitcher />)

  expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute(
    "href",
    "/es/work/chatter-snow"
  )
})

test("links back to the unprefixed English path from a Spanish page", () => {
  pathname.current = "/es/work/chatter-snow"
  renderWithI18n(<LocaleSwitcher />, { locale: "es" })

  expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
    "href",
    "/work/chatter-snow"
  )
})

test("marks the active locale and tags each link with its language", () => {
  renderWithI18n(<LocaleSwitcher />, { locale: "es" })

  const spanish = screen.getByRole("link", { name: "Español" })
  expect(spanish).toHaveAttribute("aria-current", "true")
  expect(spanish).toHaveAttribute("hreflang", "es")
  expect(screen.getByRole("link", { name: "English" })).not.toHaveAttribute("aria-current")
})

test("announces each language by its own name, not the two-letter code", () => {
  renderWithI18n(<LocaleSwitcher />)

  // Autonyms: the visible label is "ES", and assistive tech hears "Español"
  // even on the English page, so a Spanish speaker recognizes it.
  expect(screen.getByRole("link", { name: "Español" })).toBeInTheDocument()
  expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument()
})

test("remembers an explicit choice in a cookie", async () => {
  const user = userEvent.setup()
  renderWithI18n(<LocaleSwitcher />)

  await user.click(screen.getByRole("link", { name: "Español" }))

  expect(document.cookie).toContain("NEXT_LOCALE=es")
})
