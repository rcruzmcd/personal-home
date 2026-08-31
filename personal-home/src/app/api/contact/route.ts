import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { sendContactEmail } from "@/lib/email/resend"
import { isRateLimited } from "@/lib/rate-limit"
import { ContactSubmissionSchema } from "@/lib/validation/contact"

// Bots that fill and submit a form in under this many ms are almost
// certainly not human.
const MIN_SUBMIT_MS = 2000
// Reject a submission built from a page loaded more than an hour ago
// (stale/replayed form).
const MAX_SUBMIT_AGE_MS = 60 * 60 * 1000

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0].trim()
  return "unknown"
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request)

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 })
  }

  const parsed = ContactSubmissionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 400 }
    )
  }

  const { website, renderedAt, ...formData } = parsed.data

  // Honeypot filled in — fake success so bots don't learn the field is a
  // trap; don't send an email or treat it as a real submission.
  if (website) {
    return NextResponse.json({ ok: true })
  }

  const elapsed = Date.now() - renderedAt
  if (elapsed < MIN_SUBMIT_MS || elapsed > MAX_SUBMIT_AGE_MS || elapsed < 0) {
    return NextResponse.json(
      { ok: false, error: "Submission rejected. Please try again." },
      { status: 400 }
    )
  }

  await sendContactEmail(formData)

  // Always 200 once validation/spam checks pass. Whether the email actually
  // sent (RESEND_API_KEY configured, delivery succeeded) is an operational
  // detail logged server-side — not something to leak to an arbitrary
  // visitor by returning a different response.
  return NextResponse.json({ ok: true })
}
