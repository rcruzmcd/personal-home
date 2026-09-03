import { Resend } from "resend"

import { CONTACT_REASON_LABELS } from "@/lib/validation/contact"
import type { ContactFormData } from "@/lib/validation/contact"

// rickiecruz.com is a verified Resend domain. Sending from hello@ (rather
// than a dedicated noreply@) until that mailbox exists; only FROM_ADDRESS
// needs to change when it does. replyTo is set per-send to the visitor's
// address, so replying from the inbox reaches them, not this address.
const FROM_ADDRESS = "Rickie Cruz <hello@rickiecruz.com>"
const TO_ADDRESS = "hello@rickiecruz.com"

function formatSubmissionText(data: ContactFormData): string {
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.organization ? `Organization: ${data.organization}` : null,
    `Reason: ${CONTACT_REASON_LABELS[data.reason]}`,
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
  data: ContactFormData
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
      subject: `[${CONTACT_REASON_LABELS[data.reason]}] New message from ${data.name}`,
      text: formatSubmissionText(data),
    })
    return { delivered: true }
  } catch (error) {
    console.error("[contact] Resend send failed:", error, "submission:", data)
    return { delivered: false }
  }
}
