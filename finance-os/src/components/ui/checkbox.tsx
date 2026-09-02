"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

// Scaffolded via the shadcn CLI, then recolored onto the brand tokens
// (purple fill when checked, green focus outline) — see docs/STYLE_SYSTEM.md.
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border bg-surface transition-colors duration-200 outline-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:border-purple-solid data-checked:bg-purple-solid data-checked:text-white",
        "data-indeterminate:border-purple-solid data-indeterminate:bg-purple-solid data-indeterminate:text-white",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        {props.checked === "indeterminate" ? (
          <span className="block h-0.5 w-2 rounded-full bg-current" />
        ) : (
          <CheckIcon />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
