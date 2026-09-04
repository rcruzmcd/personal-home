// @vitest-environment node
import { NextRequest } from "next/server"
import { afterEach, describe, expect, test, vi } from "vitest"

const sendContactEmail = vi.fn().mockResolvedValue({ delivered: false })
vi.mock("@/lib/email/resend", () => ({
  sendContactEmail: (...args: unknown[]) => sendContactEmail(...args),
}))

const { POST } = await import("@/app/api/contact/route")

const VALID_BODY = {
  name: "Jane Doe",
  email: "jane@example.com",
  organization: "",
  reason: "consulting",
  message: "This is a real message that is long enough to pass validation.",
  // The form reports which language it was filled in so the notification can
  // say which language to reply in.
  locale: "en",
}

function makeRequest(
  body: Record<string, unknown>,
  {
    renderedAt = Date.now() - 5000,
    ip = "203.0.113.1",
    website = "",
  }: { renderedAt?: number; ip?: string; website?: string } = {}
) {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ ...body, website, renderedAt }),
  })
}

afterEach(() => {
  sendContactEmail.mockClear()
})

describe("POST /api/contact", () => {
  test("valid submission returns 200 and attempts to send (logs since no RESEND_API_KEY in tests)", async () => {
    const response = await POST(makeRequest(VALID_BODY, { ip: "203.0.113.10" }))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ ok: true })
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
  })

  test("honeypot filled in returns fake success without sending an email", async () => {
    const request = makeRequest(VALID_BODY, {
      ip: "203.0.113.11",
      website: "http://spam.example",
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ ok: true })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  test("a submission missing its locale is rejected", async () => {
    const withoutLocale: Record<string, unknown> = { ...VALID_BODY }
    delete withoutLocale.locale
    const response = await POST(makeRequest(withoutLocale, { ip: "203.0.113.20" }))

    expect(response.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  test("passes the locale through to the notification", async () => {
    await POST(
      makeRequest({ ...VALID_BODY, locale: "es" }, { ip: "203.0.113.21" })
    )

    expect(sendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "es" })
    )
  })

  test("malformed email returns 400", async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, email: "not-an-email" }, { ip: "203.0.113.12" })
    )
    expect(response.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  test("too-fast submission is rejected as likely-bot", async () => {
    const response = await POST(
      makeRequest(VALID_BODY, { renderedAt: Date.now(), ip: "203.0.113.13" })
    )
    expect(response.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  test("stale submission (form loaded over an hour ago) is rejected", async () => {
    const response = await POST(
      makeRequest(VALID_BODY, {
        renderedAt: Date.now() - 2 * 60 * 60 * 1000,
        ip: "203.0.113.14",
      })
    )
    expect(response.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  test("message shorter than 10 characters returns 400", async () => {
    const response = await POST(
      makeRequest({ ...VALID_BODY, message: "too short" }, { ip: "203.0.113.15" })
    )
    expect(response.status).toBe(400)
  })

  test("repeated rapid requests from the same IP are rate-limited", async () => {
    const ip = "203.0.113.99"
    const results: number[] = []
    for (let i = 0; i < 7; i++) {
      const response = await POST(makeRequest(VALID_BODY, { ip }))
      results.push(response.status)
    }
    expect(results.filter((status) => status === 429).length).toBeGreaterThan(0)
  })
})
