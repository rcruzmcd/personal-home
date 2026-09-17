import { locale as rootLocale } from "next/root-params"

import { LocaleLink } from "@/components/i18n/locale-link"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { COVEN_SECTION_LINKS, type CovenSectionKey } from "@/lib/coven"
import { cn } from "@/lib/utils"

/**
 * The links between the seven Coven pages, under each page's header.
 *
 * Takes the active page as a prop rather than reading the pathname, which is
 * what lets it stay a Server Component: the section's copy is long-form and
 * belongs outside the `client` catalog, and every page already knows which one
 * it is.
 */
export async function CovenSectionNav({ current }: { current: CovenSectionKey }) {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const c = t.coven

  return (
    <nav aria-label={c.navAriaLabel} className="-mx-4 mt-8 overflow-x-auto px-4">
      <ul className="flex w-max min-w-full items-center gap-x-6 gap-y-2 border-b border-border pb-3">
        {COVEN_SECTION_LINKS.map((link) => {
          const active = link.key === current
          return (
            <li key={link.href}>
              <LocaleLink
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap text-small font-medium text-foreground transition-colors duration-200 hover:text-purple",
                  active && "text-purple underline underline-offset-4"
                )}
              >
                {c.nav[link.key]}
              </LocaleLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
