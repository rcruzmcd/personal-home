"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-body text-foreground">
      <RadioGroupPrimitive.Item
        data-slot="radio-group-item"
        className={cn(
          "relative flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:border-green",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-green" />
      </RadioGroupPrimitive.Item>
      {children}
    </label>
  )
}

export { RadioGroup, RadioGroupItem }
