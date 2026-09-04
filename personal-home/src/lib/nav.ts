// Labels live in the string catalog (@/lib/i18n/dictionaries), not here — these
// entries carry the route and the catalog key that names it, so adding a locale
// never means editing this file.
export const NAV_LINKS = [
  { href: "/work", key: "work" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/consulting", key: "consulting" },
  { href: "/contact", key: "contact" },
] as const

export type NavLink = (typeof NAV_LINKS)[number]

export const FOOTER_LINKS = [
  { href: "/resume", key: "resume" },
  { href: "/privacy", key: "privacy" },
  { href: "/terms", key: "terms" },
  { href: "/contact", key: "contact" },
] as const

export type FooterLink = (typeof FOOTER_LINKS)[number]

// External profiles rendered in the footer. `event` names the analytics event
// in @/lib/analytics so adding a profile is a one-line change here rather than
// a new branch in the component. Labels are proper nouns, so they are not
// translated and stay inline.
export const SOCIAL_LINKS = [
  { href: "https://github.com/rcruzmcd", label: "GitHub", event: "github" },
  {
    href: "https://www.linkedin.com/in/ricardo-cruz-mcdougal-48a92332/",
    label: "LinkedIn",
    event: "linkedin",
  },
] as const

export type SocialLink = (typeof SOCIAL_LINKS)[number]
