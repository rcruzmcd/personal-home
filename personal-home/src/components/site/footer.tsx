import Link from "next/link"

import { FOOTER_LINKS } from "@/lib/nav"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-small text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>
          &copy; {year} Rickie Cruz. All rights reserved.
        </p>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-purple hover:underline"
            >
              {link.label}
            </Link>
          ))}
          <a href="mailto:hello@rickiecruz.com" className="text-purple hover:underline">
            hello@rickiecruz.com
          </a>
        </nav>
      </div>
    </footer>
  )
}
