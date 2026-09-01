import * as React from "react"

import { cn } from "@/lib/utils"
import { inputClasses } from "@/components/ui/input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(inputClasses, "min-h-16 field-sizing-content", className)}
      {...props}
    />
  )
}

export { Textarea }
