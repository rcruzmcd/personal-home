export const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/consulting", label: "Consulting" },
  { href: "/contact", label: "Contact" },
] as const

export const FOOTER_LINKS = [
  { href: "/resume", label: "Resume" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const

// External profiles rendered in the footer. `event` names the analytics event
// in @/lib/analytics so adding a profile is a one-line change here rather than
// a new branch in the component.
export const SOCIAL_LINKS = [
  { href: "https://github.com/rcruzmcd", label: "GitHub", event: "github" },
  {
    href: "https://www.linkedin.com/in/ricardo-cruz-mcdougal-48a92332/",
    label: "LinkedIn",
    event: "linkedin",
  },
] as const

export type SocialLink = (typeof SOCIAL_LINKS)[number]
