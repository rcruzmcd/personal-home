import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * The site's one page container. Its max-width and gutters are the same as the
 * header's and the footer's (`max-w-5xl` plus the same padding scale), so every
 * page's accent bar, title and content edges line up with the nav above them.
 *
 * Each page used to set its own width — 5xl on Home/Work/Projects/Consulting,
 * 3xl on About/Resume/the legal pages/the case studies, 2xl on Contact — so the
 * narrower ones sat visibly inset from the header. Widening the shell is not the
 * same as widening the text: long-form copy still sets its own reading measure
 * with `Prose`, and a form still sets its own column width, both inside this.
 */
export function PageShell({
  as: Tag = "main",
  id,
  brand,
  className,
  children,
}: {
  as?: "main" | "article" | "div"
  id?: string
  /**
   * Swap the accent palette for the whole page. Coven is its own product
   * brand (Indigo + Amber) and says so here rather than in each component;
   * `src/app/globals.css` rebinds the accent tokens inside the scope, so
   * every shared component follows without a Coven-specific variant. The
   * header and footer sit outside the shell and stay on the personal brand
   * — the site is hosting the product, not becoming it.
   */
  brand?: "coven"
  className?: string
  children: ReactNode
}) {
  return (
    <Tag
      id={id}
      data-brand={brand}
      className={cn(
        "mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-10",
        className
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * A reading measure for body copy. `max-w-3xl` is what the prose pages were
 * already set to before the shell widened, so paragraph line length is
 * unchanged; what changes is that the text is now a column inside a full-width
 * page rather than the page itself.
 *
 * Wrap prose in it, not tables, stat rows, or card grids — those are meant to
 * use the shell's full width.
 */
export function Prose({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={cn("max-w-3xl", className)}>{children}</div>
}
