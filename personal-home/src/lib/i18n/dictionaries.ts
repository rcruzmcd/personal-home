import "server-only"

import type { Locale } from "./locales"
import type { Dictionary } from "./dictionaries/en"

// Dynamic imports so a locale's catalog is only loaded when a page in that
// locale renders, rather than bundling every language into every route.
const DICTIONARIES: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.en),
  es: () => import("./dictionaries/es").then((m) => m.es),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return DICTIONARIES[locale]()
}

export type { Dictionary }
