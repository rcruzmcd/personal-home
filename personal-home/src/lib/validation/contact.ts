import { z } from "zod"

export const CONTACT_REASON_VALUES = [
  "consulting",
  "website-application",
  "technical-question",
  "collaboration",
  "employment",
  "other",
] as const

export type ContactReason = (typeof CONTACT_REASON_VALUES)[number]

export const CONTACT_REASON_LABELS: Record<ContactReason, string> = {
  consulting: "Consulting",
  "website-application": "Website / application",
  "technical-question": "Technical question",
  collaboration: "Collaboration",
  employment: "Employment",
  other: "Other",
}

// Shared by the client-side form and the API route so validation can never
// drift between the two.
export const ContactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  email: z.email("Enter a valid email address."),
  organization: z.string().trim().max(200).optional(),
  reason: z.enum(CONTACT_REASON_VALUES, {
    error: "Choose what you'd like help with.",
  }),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(5000),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

// Anti-spam fields, not shown to the user as "real" form fields.
export const ContactSubmissionSchema = ContactFormSchema.extend({
  // Honeypot — real users never fill this in (hidden via CSS, not
  // display:none, since some bots skip display:none fields). Deliberately
  // unconstrained here (no .max(0)) — the route checks truthiness itself
  // and returns a fake success, so a filled honeypot must still pass
  // schema validation rather than surface a distinguishable 400 that would
  // tip a bot off that the field is a trap.
  website: z.string().optional(),
  // Client timestamp (ms) captured when the form mounted, used to reject
  // implausibly fast (bot) or stale (replayed) submissions.
  renderedAt: z.number(),
})

export type ContactSubmissionData = z.infer<typeof ContactSubmissionSchema>
