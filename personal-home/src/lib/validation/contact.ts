import { z } from "zod"

import { LOCALES } from "@/lib/i18n/locales"

export const CONTACT_REASON_VALUES = [
  "consulting",
  "website-application",
  "technical-question",
  "collaboration",
  "employment",
  "other",
] as const

export type ContactReason = (typeof CONTACT_REASON_VALUES)[number]

// The messages the schema needs, named so the caller can hand over a slice of
// the string catalog directly.
export type ContactValidationMessages = {
  nameRequired: string
  emailInvalid: string
  reasonRequired: string
  messageTooShort: string
}

// A factory rather than a constant, because the messages are language-dependent
// while the rules are not. The client form and the API route both build from
// this, so validation still can't drift between the two.
export function buildContactFormSchema(messages: ContactValidationMessages) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired).max(200),
    email: z.email(messages.emailInvalid),
    organization: z.string().trim().max(200).optional(),
    reason: z.enum(CONTACT_REASON_VALUES, { error: messages.reasonRequired }),
    message: z.string().trim().min(10, messages.messageTooShort).max(5000),
  })
}

export type ContactFormData = z.infer<ReturnType<typeof buildContactFormSchema>>

// Anti-spam fields, not shown to the user as "real" form fields.
export function buildContactSubmissionSchema(messages: ContactValidationMessages) {
  return buildContactFormSchema(messages).extend({
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
    // Route Handlers can't read next/root-params, so the form states which
    // language it was filled in. It picks the error messages, and it tells
    // Rickie which language to reply in.
    locale: z.enum(LOCALES),
  })
}

export type ContactSubmissionData = z.infer<ReturnType<typeof buildContactSubmissionSchema>>
