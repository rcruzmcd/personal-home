import { Fragment, type ReactNode } from "react"
import { LocaleLink } from "@/components/i18n/locale-link"

import { AccentBar } from "@/components/ui/accent-bar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export type BreadcrumbTrailItem = { label: string; href: string }

/**
 * The standard top of a page: breadcrumb → accent bar → title → supporting
 * line, with the page's key figures and its actions on the opposite end of the
 * title row. Every page uses this so location, headline figures and the primary
 * action always land in the same place (see docs/UX_PATTERNS.md).
 *
 * `eyebrow`, `stats` and `actions` are slots rather than data props — a header
 * shouldn't need to know how a page's numbers are computed or where its buttons
 * link. Breadcrumb labels are the destination's own page title, and the current
 * page is the last node and never a link.
 *
 * `compact` drops the title to h2 for narrow single-column screens, where a
 * 48px heading would outweigh the content it introduces.
 */
export function PageHeader({
  title,
  breadcrumb,
  eyebrow,
  description,
  stats,
  actions,
  compact = false,
  className,
}: {
  title: string
  breadcrumb?: BreadcrumbTrailItem[]
  eyebrow?: ReactNode
  description?: ReactNode
  stats?: ReactNode
  actions?: ReactNode
  compact?: boolean
  className?: string
}) {
  return (
    <header className={className}>
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumb.map((item) => (
              <Fragment key={item.href}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <LocaleLink href={item.href}>{item.label}</LocaleLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <AccentBar width="md" className="mb-6" />

      {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}

      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <h1
          className={cn(
            "text-purple",
            compact ? "text-h2 font-semibold" : "text-h1 font-bold"
          )}
        >
          {title}
        </h1>
        {stats || actions ? (
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            {stats}
            {/* Actions sit last, and the primary one last within them — one
                primary per header, always in the same corner. */}
            {actions ? (
              <div className="flex flex-wrap items-center gap-3">{actions}</div>
            ) : null}
          </div>
        ) : null}
      </div>

      {description ? (
        <div className="mt-4 max-w-2xl text-body text-foreground">{description}</div>
      ) : null}
    </header>
  )
}
