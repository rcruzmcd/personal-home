import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statValueVariants = cva("font-bold", {
  variants: {
    tone: {
      neutral: "text-foreground",
      positive: "text-green",
      accent: "text-purple",
    },
    size: {
      // Header stats, where the figure is the point of the row.
      default: "text-h2",
      // In-body grids, where several figures sit inside a narrow column.
      sm: "text-h4 font-semibold",
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: "default",
  },
})

/**
 * A labelled headline figure — the unit a page header or a metrics grid uses to
 * answer "how is this doing?" before the reader scrolls. Label above value (not
 * beside it) so several stats line up as a row of equal-width columns.
 *
 * See docs/UX_PATTERNS.md — a figure shown as a header stat must not also be
 * repeated as a row in the page body.
 */
function Stat({
  label,
  value,
  tone,
  size,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof statValueVariants> & {
    label: React.ReactNode
    value: React.ReactNode
  }) {
  return (
    <div data-slot="stat" className={className} {...props}>
      <p className="text-small text-muted">{label}</p>
      <p className={cn(statValueVariants({ tone, size }))}>{value}</p>
    </div>
  )
}

export { Stat, statValueVariants }
