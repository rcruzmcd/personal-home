import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./locales"

// Every locale that carries a URL prefix. English is served unprefixed, so it
// is deliberately absent here.
const PREFIXED_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE)

/**
 * Splits a pathname into its locale prefix and the locale-independent path.
 *
 * "/es/work/chatter-snow" -> { locale: "es", path: "/work/chatter-snow" }
 * "/work/chatter-snow"    -> { locale: "en", path: "/work/chatter-snow" }
 * "/es"                   -> { locale: "es", path: "/" }
 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of PREFIXED_LOCALES) {
    if (pathname === `/${locale}`) return { locale, path: "/" }
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) }
    }
  }
  return { locale: DEFAULT_LOCALE, path: pathname }
}

/**
 * Applies a locale's prefix to a locale-independent path. The default locale is
 * unprefixed, so this is the identity for English.
 */
export function localizeHref(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path
  return path === "/" ? `/${locale}` : `/${locale}${path}`
}

/**
 * The counterpart of `pathname` in `target`. Used by the locale switcher so a
 * visitor deep in a case study stays on that case study instead of being
 * dropped on the homepage.
 */
export function switchLocaleHref(pathname: string, target: Locale): string {
  return localizeHref(splitLocale(pathname).path, target)
}

export type LocaleRoute =
  // Already addressed to a prefixed locale — render it as-is.
  | { kind: "pass" }
  // Rewrite is invisible to the visitor: the URL stays "/about" while the
  // prerendered "/en/about" is served. This is what keeps English unprefixed
  // without duplicating the route files.
  | { kind: "rewrite"; pathname: string }
  // Redirect is visible, and exists so a page has exactly one public URL.
  | { kind: "redirect"; pathname: string }

/**
 * The whole locale routing policy, as a pure function so it can be tested
 * without constructing Next requests. `src/proxy.ts` is a thin adapter over it.
 */
export function resolveLocaleRoute(pathname: string, cookieLocale?: string): LocaleRoute {
  // "/en/about" is an internal address, not a public one — the public URL is
  // "/about". Without this redirect both would serve identical HTML and split
  // their own search ranking.
  if (pathname === `/${DEFAULT_LOCALE}`) return { kind: "redirect", pathname: "/" }
  if (pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    return { kind: "redirect", pathname: pathname.slice(DEFAULT_LOCALE.length + 1) }
  }

  for (const locale of PREFIXED_LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return { kind: "pass" }
    }
  }

  // Only the bare root honours a remembered choice. Applying it to every path
  // would hijack shared deep links ("/work/chatter-snow" is an English URL that
  // someone chose to send) and hand crawlers a different page than the one they
  // requested.
  if (pathname === "/" && isLocale(cookieLocale) && cookieLocale !== DEFAULT_LOCALE) {
    return { kind: "redirect", pathname: `/${cookieLocale}` }
  }

  return { kind: "rewrite", pathname: localizeInternal(pathname) }
}

// The internal address of an unprefixed path: what the router actually matches
// against `app/[locale]/...`.
function localizeInternal(pathname: string): string {
  return pathname === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`
}
