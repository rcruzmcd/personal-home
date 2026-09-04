"use client"

import * as React from "react"

import type { Locale } from "@/lib/i18n/locales"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

// Server Components read the locale from `next/root-params`, but that module is
// unavailable in Client Components, Server Actions and Route Handlers — so the
// handful of client components that render copy get it through this context
// instead.
//
// Only the `client` slice of the catalog crosses the boundary. Passing the whole
// dictionary would ship the resume, privacy and terms prose in the JS bundle for
// every visitor.
type ClientMessages = Dictionary["client"]

type I18nValue = {
  locale: Locale
  messages: ClientMessages
}

const I18nContext = React.createContext<I18nValue | null>(null)

export function I18nProvider({
  locale,
  messages,
  children,
}: I18nValue & { children: React.ReactNode }) {
  // The object is rebuilt per render, but the React Compiler memoizes it and
  // both fields are stable for the life of a page.
  return (
    <I18nContext.Provider value={{ locale, messages }}>{children}</I18nContext.Provider>
  )
}

function useI18n(): I18nValue {
  const value = React.useContext(I18nContext)
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>")
  }
  return value
}

export function useMessages(): ClientMessages {
  return useI18n().messages
}

export function useLocale(): Locale {
  return useI18n().locale
}
