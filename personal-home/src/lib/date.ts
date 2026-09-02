// Frontmatter dates are date-only ISO strings ("2026-09-01"), which `new Date`
// parses as UTC midnight. Formatting those in the machine's local zone renders
// the previous day anywhere west of UTC, so every format here pins to UTC.
const DISPLAY_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", DISPLAY_FORMAT)
}

// The date a page should present as its own: its last revision if it has one,
// otherwise its publication. Shared by the visible byline, the JSON-LD, and the
// sitemap so all three can't drift apart.
export function lastModified(project: {
  publishedDate: string
  updatedDate?: string
}): string {
  return project.updatedDate ?? project.publishedDate
}
