"use client"

import { usePathname } from "next/navigation"

import { LocaleLink } from "@/components/i18n/locale-link"
import { useMessages } from "@/components/i18n/i18n-provider"
import { cn } from "@/lib/utils"
import { splitLocale } from "@/lib/i18n/routing"
import { NAV_LINKS } from "@/lib/nav"

// Compared against the locale-independent path, so "/es/work" highlights the
// Work link exactly as "/work" does.
function isLinkActive(pathname: string, href: string) {
  const { path } = splitLocale(pathname)
  return path === href || path.startsWith(`${href}/`)
}

export function NavLinks({
  className,
  linkClassName,
  onNavigate,
}: {
  className?: string
  linkClassName?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const messages = useMessages()

  return (
    <div className={className}>
      {NAV_LINKS.map((link) => {
        const active = isLinkActive(pathname, link.href)
        return (
          <LocaleLink
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-small font-medium text-foreground hover:text-purple transition-colors duration-200",
              active && "text-purple underline underline-offset-4",
              linkClassName
            )}
          >
            {messages.nav[link.key]}
          </LocaleLink>
        )
      })}
    </div>
  )
}
