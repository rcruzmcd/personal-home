"use client"

import { usePathname } from "next/navigation"

import { LocaleLink } from "@/components/i18n/locale-link"
import { useMessages } from "@/components/i18n/i18n-provider"
import { cn } from "@/lib/utils"
import { isLinkActive, NAV_LINKS } from "@/lib/nav"

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
