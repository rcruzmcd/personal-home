import { Resend } from "resend"

import { en } from "@/lib/i18n/dictionaries/en"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales"
import type { ContactFormData } from "@/lib/validation/contact"

// The notification is addressed to Rickie, not to the visitor, so it stays in
// English regardless of which language the form was filled in. The visitor's
// language is reported as a line in the body instead, so he knows to reply in
// Spanish.
const REASON_LABELS = en.client.contactForm.reasons

type ContactNotification = ContactFormData & { locale: Locale }

// The verified Resend sending domain is the send.rickiecruz.com subdomain
// (DKIM at resend._domainkey.send, return-path CNAMEs at send.send and
// rsend.send). The root domain's SPF stays Zoho-only, since Zoho receives
// mail for rickiecruz.com.
//
// The From address must be @send.rickiecruz.com. Sending from the bare
// root domain gets a 403 from Resend, which this module swallows into
// { delivered: false }, so the form would look healthy while every message
// went nowhere but the server log. noreply@ needs no mailbox: sending
// depends only on DNS, and replyTo is set per-send to the visitor's address.
const FROM_ADDRESS = "noreply@send.rickiecruz.com"
const TO_ADDRESS = "hello@rickiecruz.com"

function formatSubmissionText(data: ContactNotification): string {
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.organization ? `Organization: ${data.organization}` : null,
    `Reason: ${REASON_LABELS[data.reason]}`,
    data.locale === DEFAULT_LOCALE ? null : `Language: ${data.locale} — reply in Spanish`,
    "",
    data.message,
  ]
  return lines.filter((line) => line !== null).join("\n")
}

// Always attempts to send when RESEND_API_KEY is configured; otherwise logs
// the full submission so nothing is silently lost before the key is set up
// (domain/email infrastructure isn't necessarily configured yet). Callers
// should treat { delivered: false } as "logged, not emailed" — not an
// error — and still tell the visitor their message was received.
export async function sendContactEmail(
  data: ContactNotification
): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY not set — logging submission instead of emailing:",
      data
    )
    return { delivered: false }
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: data.email,
      subject: `[${REASON_LABELS[data.reason]}] New message from ${data.name}`,
      text: formatSubmissionText(data),
    })
    return { delivered: true }
  } catch (error) {
    console.error("[contact] Resend send failed:", error, "submission:", data)
    return { delivered: false }
  }
}
