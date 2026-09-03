"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Scaffolded from the shadcn CLI's `progress` recipe, then recolored onto the
// brand tokens — see docs/STYLE_SYSTEM.md. The indicator color is left to the
// caller (`indicatorClassName`) because the same bar means different things on
// different screens; the budgets meter maps it to under/near/over.
//
// rounded-full is deliberate here and within the radius rule: an 8px-tall bar
// is genuinely pill-shaped, the same exception pill.tsx takes.
function Progress({
  className,
  indicatorClassName,
  value,
  max,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string
}) {
  const ceiling = max ?? 100
  // Radix requires 0 <= value <= max; a caller reporting an overrun passes the
  // real numbers and the bar simply reads full.
  const clamped = Math.min(Math.max(value ?? 0, 0), ceiling)
  const pct = ceiling > 0 ? (clamped / ceiling) * 100 : 0

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={clamped}
      max={ceiling}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-border", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all duration-300",
          indicatorClassName ?? "bg-purple",
        )}
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
