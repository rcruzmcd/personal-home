import { track } from "@vercel/analytics"

// Thin wrapper around @vercel/analytics' track() so the 8 named events from
// docs/WEBSITE_REQUIREMENTS.md live in one typed place. Swapping analytics
// providers later (e.g. to Plausible) only touches this file.

export function trackProjectView(props: { slug: string; category: "work" | "project" }) {
  track("project_view", props)
}

export function trackResumeDownload() {
  track("resume_download")
}

export function trackContactStarted() {
  track("contact_started")
}

export function trackContactSubmitted(props: { reason: string }) {
  track("contact_submitted", props)
}

export function trackConsultingView() {
  track("consulting_view")
}

export function trackExternalProjectClick(props: { slug: string; url: string; linkType: string }) {
  track("external_project_click", props)
}

// Not wired to a link anywhere yet — no real GitHub/LinkedIn profile URL
// exists in the site content (see the Phase 0 footer build note). Kept
// here, ready to call once those links are added.
export function trackGithubClick() {
  track("github_click")
}

export function trackLinkedinClick() {
  track("linkedin_click")
}
