"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("block text-small font-medium text-foreground mb-2", className)}
      {...props}
    >
      {children}
      {required && <span className="text-purple"> *</span>}
    </LabelPrimitive.Root>
  )
}

export { Label }
