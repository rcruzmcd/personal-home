import Link from "next/link"

import { NavLinks } from "@/components/site/nav-links"
import { MobileNav } from "@/components/site/mobile-nav"
import { ThemeToggle } from "@/components/site/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-8 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="text-xl font-bold text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        >
          Rickie Cruz
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <NavLinks className="flex items-center gap-6" />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
