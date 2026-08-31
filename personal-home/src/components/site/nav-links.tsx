"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { NAV_LINKS } from "@/lib/nav"

function isLinkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
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

  return (
    <div className={className}>
      {NAV_LINKS.map((link) => {
        const active = isLinkActive(pathname, link.href)
        return (
          <Link
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
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
