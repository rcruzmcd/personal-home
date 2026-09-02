import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The brand type scale (docs/STYLE_SYSTEM.md) uses custom names — `text-body`,
// `text-small`, `text-h2`. tailwind-merge can't tell those from text *colors*
// (`text-muted`, `text-purple`), so out of the box it treats them as the same
// class group and drops the size: `cn("text-small text-muted")` rendered as
// `text-muted` alone. Registering the scale keeps size and color independent.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1", "h2", "h3", "h4", "body", "small", "label"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
