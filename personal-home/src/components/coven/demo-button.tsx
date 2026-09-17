"use client"

import { Button } from "@/components/ui/button"
import { trackCovenDemoClick } from "@/lib/analytics"
import { COVEN_DEMO_URL } from "@/lib/coven"

/**
 * The section's one primary action, on every page. Copy arrives as props from
 * the Server Component that renders it: this needs to be a Client Component to
 * record the click, and shipping the whole Coven catalog to the browser to
 * label one button would be a poor trade.
 *
 * The demo is a different origin, so this is a plain anchor rather than
 * LocaleLink — there is no locale prefix to apply to it.
 */
export function DemoButton({
  label,
  newTabHint,
  from,
  variant = "primary",
  className,
}: {
  label: string
  newTabHint: string
  from: string
  variant?: "primary" | "secondary"
  className?: string
}) {
  return (
    <Button asChild variant={variant} className={className}>
      <a
        href={COVEN_DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCovenDemoClick({ from })}
      >
        {label}
        <span className="sr-only"> {newTabHint}</span>
      </a>
    </Button>
  )
}
