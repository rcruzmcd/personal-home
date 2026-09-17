import { splitLocale } from "@/lib/i18n/routing"

// Labels live in the string catalog (@/lib/i18n/dictionaries), not here — these
// entries carry the route and the catalog key that names it, so adding a locale
// never means editing this file.
export const NAV_LINKS = [
  { href: "/work", key: "work" },
  { href: "/projects", key: "projects" },
  // TODO: Coven is moving to its own site — the /coven routes, their
  // sitemap entries and the "coven" nav string stay in place until then,
  // but the section is kept out of the site nav.
  // { href: "/coven", key: "coven" },
  { href: "/about", key: "about" },
  { href: "/consulting", key: "consulting" },
  { href: "/contact", key: "contact" },
] as const

export type NavLink = (typeof NAV_LINKS)[number]

/**
 * Whether a nav link names the section the visitor is in. Compared against the
 * locale-independent path, so "/es/work" highlights the Work link exactly as
 * "/work" does, and a child route ("/coven/pricing") still highlights its
 * parent. Lives here rather than in the nav component because more than one
 * nav needs it and it is worth testing without a render.
 */
export function isLinkActive(pathname: string, href: string): boolean {
  const { path } = splitLocale(pathname)
  return path === href || path.startsWith(`${href}/`)
}

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
