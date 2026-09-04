import { locale as rootLocale } from "next/root-params"

import { LocaleLink } from "@/components/i18n/locale-link"
import { SocialLinks } from "@/components/site/social-links"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { FOOTER_LINKS } from "@/lib/nav"

export async function Footer() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-small text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>{t.footer.copyright(year)}</p>

        <nav aria-label={t.footer.navAriaLabel} className="flex flex-wrap items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <LocaleLink
              key={link.href}
              href={link.href}
              className="text-purple hover:underline"
            >
              {t.footer[link.key]}
            </LocaleLink>
          ))}
        </nav>

        <nav aria-label={t.footer.profilesAriaLabel}>
          <SocialLinks />
        </nav>
      </div>
    </footer>
  )
}
