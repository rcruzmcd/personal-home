import { cn } from "@/lib/utils"

// Compact, rounded filter chip used for navigation-style selections (e.g.
// the transaction list's year/month timeframes). Exported as a class string
// rather than a component so it can style whichever element the caller
// needs — a Link, a button, or a plain span.
const pillClasses =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-small font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"

const pillActiveClasses = "border-purple-solid bg-purple-solid text-white"
const pillInactiveClasses =
  "border-border bg-surface text-muted hover:text-purple hover:bg-border"

function pillVariant(active: boolean, className?: string) {
  return cn(pillClasses, active ? pillActiveClasses : pillInactiveClasses, className)
}

export { pillClasses, pillActiveClasses, pillInactiveClasses, pillVariant }
