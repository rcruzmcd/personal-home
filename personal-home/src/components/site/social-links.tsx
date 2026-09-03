"use client"

import { trackGithubClick, trackLinkedinClick } from "@/lib/analytics"
import { SOCIAL_LINKS } from "@/lib/nav"

const TRACKERS: Record<string, () => void> = {
  github: trackGithubClick,
  linkedin: trackLinkedinClick,
}

export function SocialLinks() {
  return (
    <ul className="flex flex-wrap items-center gap-6">
      {SOCIAL_LINKS.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="me noopener noreferrer"
            onClick={() => TRACKERS[link.event]?.()}
            className="text-purple hover:underline"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
