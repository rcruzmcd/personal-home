import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center text-label font-medium px-3 py-1 rounded-md",
  {
    variants: {
      variant: {
        active: "bg-green text-white uppercase",
        featured: "bg-purple text-white uppercase",
        tech: "bg-background text-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "tech",
    },
  }
)

function Badge({
  className,
  variant = "tech",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
