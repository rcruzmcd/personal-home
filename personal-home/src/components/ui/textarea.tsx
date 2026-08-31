import * as React from "react"

import { cn } from "@/lib/utils"
import { inputClasses } from "@/components/ui/input"

function Textarea({
  className,
  rows = 4,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      data-slot="textarea"
      className={cn(inputClasses, "min-h-24 resize-y", className)}
      {...props}
    />
  )
}

export { Textarea }
