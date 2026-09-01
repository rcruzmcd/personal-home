import * as React from "react"

import { cn } from "@/lib/utils"

const inputClasses =
  "w-full bg-surface border border-border rounded-md px-4 py-2 text-body text-foreground placeholder:text-muted focus:border-purple focus:border-2 focus:ring-4 focus:ring-purple/10 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputClasses, className)}
      {...props}
    />
  )
}

export { Input, inputClasses }
