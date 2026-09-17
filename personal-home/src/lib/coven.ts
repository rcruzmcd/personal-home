// The structure of the Coven marketing section: ids, ordering, routes and the
// one external URL. Every string a visitor reads lives in the catalog
// (@/lib/i18n/dictionaries) keyed by these ids, so adding a locale never means
// editing this file and reordering a list never means editing prose.

// The product's one conversion point. No signup, seeded fictional data, rebuilt
// nightly — every page in the section links it.
export const COVEN_DEMO_URL = "https://demo.rickiecruz.com"

export const COVEN_MODULES = [
  "finance",
  "people",
  "volunteers",
  "programs",
  "events",
  "inventory",
  "governance",
  "content",
] as const

export type CovenModuleId = (typeof COVEN_MODULES)[number]

// Governance is the nonprofit moat: board, meetings, minutes, resolutions. It
// is dropped from the business path outright rather than stretched into
// "advisory board minutes", so the type says so and the catalog can't carry
// business copy for it.
export type CovenBusinessModuleId = Exclude<CovenModuleId, "governance">

// Order is emphasis. Each audience leads with what it came looking for:
// nonprofits with governance, businesses with the money and the bookings.
export const NONPROFIT_MODULES = [
  "governance",
  "finance",
  "people",
  "volunteers",
  "programs",
  "events",
  "inventory",
  "content",
] as const satisfies readonly CovenModuleId[]

export const BUSINESS_MODULES = [
  "finance",
  "events",
  "people",
  "programs",
  "inventory",
  "volunteers",
  "content",
] as const satisfies readonly CovenBusinessModuleId[]

export const COVEN_PLANS = ["small", "growing", "established"] as const

export type CovenPlanId = (typeof COVEN_PLANS)[number]

// The section's own pages. `key` names the catalog entry that labels the link;
// the page components pass their own id as `current` rather than reading the
// pathname, which keeps the section nav a Server Component.
export const COVEN_SECTION_LINKS = [
  { href: "/coven", key: "overview" },
  { href: "/coven/nonprofits", key: "nonprofits" },
  { href: "/coven/business", key: "business" },
  { href: "/coven/modules", key: "modules" },
  { href: "/coven/pricing", key: "pricing" },
  { href: "/coven/security", key: "security" },
  { href: "/coven/faq", key: "faq" },
] as const

export type CovenSectionKey = (typeof COVEN_SECTION_LINKS)[number]["key"]
