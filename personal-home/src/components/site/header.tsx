import { LocaleLink } from "@/components/i18n/locale-link"
import { LocaleSwitcher } from "@/components/i18n/locale-switcher"
import { NavLinks } from "@/components/site/nav-links"
import { MobileNav } from "@/components/site/mobile-nav"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { locale as rootLocale } from "next/root-params"

export async function Header() {
  const t = await getDictionary(assertLocale(await rootLocale()))

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-8 px-4 py-4 sm:px-6 lg:px-10">
        <LocaleLink
          href="/"
          className="text-xl font-bold text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        >
          {t.common.siteName}
        </LocaleLink>

        <nav aria-label={t.client.nav.ariaLabel} className="hidden md:block">
          <NavLinks className="flex items-center gap-6" />
        </nav>

        <div className="flex items-center gap-2">
          {/* Hidden on small screens, where it moves into the mobile sheet
              rather than competing with the menu button for space. */}
          <LocaleSwitcher className="hidden md:flex" />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
