import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const accentBarVariants = cva("h-1 bg-purple", {
  variants: {
    width: {
      sm: "w-10",
      md: "w-12",
      lg: "w-14",
    },
  },
  defaultVariants: {
    width: "md",
  },
})

function AccentBar({
  className,
  width,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof accentBarVariants>) {
  return (
    <div
      data-slot="accent-bar"
      className={cn(accentBarVariants({ width }), className)}
      {...props}
    />
  )
}

export { AccentBar, accentBarVariants }
