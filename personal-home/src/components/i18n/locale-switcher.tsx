"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useLocale, useMessages } from "@/components/i18n/i18n-provider"
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_NAMES,
  LOCALE_SHORT_NAMES,
  type Locale,
} from "@/lib/i18n/locales"
import { switchLocaleHref } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"

// A year, so a returning reader doesn't have to re-pick. Written client-side
// because the locale is already in the URL — nothing needs to be re-rendered on
// the server, which keeps every page statically prerendered.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function rememberLocale(locale: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`
  } catch {
    // Cookies can be blocked outright. The switch still works — it just won't
    // be remembered on the next visit — so there is nothing to recover from.
  }
}

/**
 * Real anchors rather than a <select>, so each locale is a crawlable link that
 * search engines can follow and associate via hreflang.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const active = useLocale()
  const messages = useMessages()
  const pathname = usePathname()

  return (
    <nav
      aria-label={messages.localeSwitcher.ariaLabel}
      className={cn("flex items-center gap-1", className)}
    >
      {LOCALES.map((locale) => {
        const isActive = locale === active
        return (
          <Link
            key={locale}
            href={switchLocaleHref(pathname, locale)}
            hrefLang={locale}
            // aria-current marks the active language; the visible label is a
            // two-letter code, so the full language name is announced instead.
            aria-current={isActive ? "true" : undefined}
            onClick={() => rememberLocale(locale)}
            className={cn(
              "rounded px-2 py-1 text-small font-medium transition-colors duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
              isActive
                ? "text-purple underline underline-offset-4"
                : "text-muted hover:text-purple"
            )}
          >
            <span aria-hidden="true">{LOCALE_SHORT_NAMES[locale]}</span>
            <span className="sr-only">{LOCALE_NAMES[locale]}</span>
          </Link>
        )
      })}
    </nav>
  )
}
