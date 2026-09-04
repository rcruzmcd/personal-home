// The site is served with English unprefixed (`/about`) and every other locale
// prefixed (`/es/about`), so the existing English URLs keep working untouched.
// DEFAULT_LOCALE is the one that gets no prefix — changing it would change every
// canonical URL on the site, so it isn't a casual edit.
export const LOCALES = ["en", "es"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

// The cookie is written only by an explicit click on the locale switcher. The
// site never infers a locale from Accept-Language — docs/WEBSITE_REQUIREMENTS.md
// puts browser/geo auto-detection out of scope ("respect explicit user choice
// only"), and guessing tends to strand bilingual readers on the wrong version.
export const LOCALE_COOKIE = "NEXT_LOCALE"

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
}

// Root params and route params arrive as `string | undefined`, but every route
// lives under `[locale]` and only ever prerenders the values in LOCALES, so an
// unrecognized one is a routing bug rather than bad user input — fail loudly
// instead of silently serving English.
export function assertLocale(value: unknown): Locale {
  if (!isLocale(value)) {
    throw new Error(`Unsupported locale: ${String(value)}`)
  }
  return value
}

// BCP 47 tags for Intl formatting. "es-419" is Latin American Spanish, which
// matches the neutral register the site's copy is written in.
const INTL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  es: "es-419",
}

export function intlLocale(locale: Locale): string {
  return INTL_LOCALES[locale]
}

// Open Graph wants an `xx_XX` territory form, which has no neutral-Spanish
// value; es_ES is the conventional stand-in. `hreflang` stays region-neutral
// ("es") — see buildAlternates in @/lib/seo.
const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
}

export function ogLocale(locale: Locale): string {
  return OG_LOCALES[locale]
}

// Autonyms — each language named in itself, so the switcher reads the same
// whichever page it is rendered on. Deliberately not in the string catalog:
// translating these would defeat the point.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
}

export const LOCALE_SHORT_NAMES: Record<Locale, string> = {
  en: "EN",
  es: "ES",
}
