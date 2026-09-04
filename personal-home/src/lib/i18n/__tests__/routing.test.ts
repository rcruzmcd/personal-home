import { describe, expect, it } from "vitest"

import {
  localizeHref,
  resolveLocaleRoute,
  splitLocale,
  switchLocaleHref,
} from "../routing"

describe("splitLocale", () => {
  it("pulls a prefixed locale off the path", () => {
    expect(splitLocale("/es/work/chatter-snow")).toEqual({
      locale: "es",
      path: "/work/chatter-snow",
    })
  })

  it("treats a bare locale prefix as the root path", () => {
    expect(splitLocale("/es")).toEqual({ locale: "es", path: "/" })
  })

  it("reads an unprefixed path as the default locale", () => {
    expect(splitLocale("/work")).toEqual({ locale: "en", path: "/work" })
  })

  // "/estimates" starts with the letters "es" but is not the Spanish prefix.
  it("does not mistake a path that merely starts with a locale's letters", () => {
    expect(splitLocale("/estimates")).toEqual({ locale: "en", path: "/estimates" })
  })
})

describe("localizeHref", () => {
  it("leaves the default locale unprefixed", () => {
    expect(localizeHref("/about", "en")).toBe("/about")
    expect(localizeHref("/", "en")).toBe("/")
  })

  it("prefixes other locales", () => {
    expect(localizeHref("/about", "es")).toBe("/es/about")
  })

  it("renders the localized root without a trailing slash", () => {
    expect(localizeHref("/", "es")).toBe("/es")
  })
})

describe("switchLocaleHref", () => {
  it("keeps the visitor on the same page in both directions", () => {
    expect(switchLocaleHref("/work/chatter-snow", "es")).toBe("/es/work/chatter-snow")
    expect(switchLocaleHref("/es/work/chatter-snow", "en")).toBe("/work/chatter-snow")
  })

  it("round-trips back to the original path", () => {
    const original = "/projects/personal-finance-os"
    expect(switchLocaleHref(switchLocaleHref(original, "es"), "en")).toBe(original)
  })

  it("maps between the two roots", () => {
    expect(switchLocaleHref("/", "es")).toBe("/es")
    expect(switchLocaleHref("/es", "en")).toBe("/")
  })

  it("is a no-op when the target locale is already active", () => {
    expect(switchLocaleHref("/es/about", "es")).toBe("/es/about")
  })
})

describe("resolveLocaleRoute", () => {
  it("rewrites an unprefixed path to its internal English address", () => {
    expect(resolveLocaleRoute("/about")).toEqual({ kind: "rewrite", pathname: "/en/about" })
    expect(resolveLocaleRoute("/")).toEqual({ kind: "rewrite", pathname: "/en" })
  })

  it("passes a Spanish path through untouched", () => {
    expect(resolveLocaleRoute("/es/about")).toEqual({ kind: "pass" })
    expect(resolveLocaleRoute("/es")).toEqual({ kind: "pass" })
  })

  // "/en/about" and "/about" would otherwise serve identical HTML at two URLs.
  it("redirects the internal English address to the public one", () => {
    expect(resolveLocaleRoute("/en/about")).toEqual({ kind: "redirect", pathname: "/about" })
    expect(resolveLocaleRoute("/en")).toEqual({ kind: "redirect", pathname: "/" })
  })

  it("honours a remembered locale at the root", () => {
    expect(resolveLocaleRoute("/", "es")).toEqual({ kind: "redirect", pathname: "/es" })
  })

  it("ignores a remembered locale on any other path, so shared links stay put", () => {
    expect(resolveLocaleRoute("/work", "es")).toEqual({ kind: "rewrite", pathname: "/en/work" })
  })

  it("ignores a cookie holding the default or an unknown locale", () => {
    expect(resolveLocaleRoute("/", "en")).toEqual({ kind: "rewrite", pathname: "/en" })
    expect(resolveLocaleRoute("/", "fr")).toEqual({ kind: "rewrite", pathname: "/en" })
    expect(resolveLocaleRoute("/", undefined)).toEqual({ kind: "rewrite", pathname: "/en" })
  })
})
