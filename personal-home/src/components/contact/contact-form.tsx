"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  CONTACT_REASON_LABELS,
  CONTACT_REASON_VALUES,
  ContactFormSchema,
  type ContactFormData,
} from "@/lib/validation/contact"
import { trackContactStarted, trackContactSubmitted } from "@/lib/analytics"

type FormState = {
  name: string
  email: string
  organization: string
  reason: ContactFormData["reason"] | ""
  message: string
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  organization: "",
  reason: "",
  message: "",
}

type Status = "idle" | "submitting" | "success" | "error"

export function ContactForm() {
  const [values, setValues] = React.useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = React.useState<Status>("idle")
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  // useState's lazy initializer (not useRef) is the sanctioned way to run
  // an impure one-time computation like Date.now() during render.
  const [renderedAt] = React.useState(() => Date.now())
  const hasStartedRef = React.useRef(false)

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      trackContactStarted()
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = ContactFormSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormState
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setStatus("submitting")
    setSubmitError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          website: "",
          renderedAt,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(
          typeof body?.error === "string" ? body.error : "Something went wrong. Please try again."
        )
      }

      setStatus("success")
      setValues(INITIAL_STATE)
      trackContactSubmitted({ reason: result.data.reason })
    } catch (error) {
      setStatus("error")
      setSubmitError(error instanceof Error ? error.message : "Something went wrong.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-body text-foreground">
        <p className="font-semibold text-purple">Thanks — your message is on its way.</p>
        <p className="mt-2 text-small text-muted">I&apos;ll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot: visually hidden via clipping (not display:none, which
          some bots skip) and aria-hidden so assistive tech never announces
          it. `sr-only` here is the CSS technique, not "for screen readers"
          — aria-hidden on this wrapper takes precedence and hides it from
          the accessibility tree entirely. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name ? (
          <p id="name-error" className="mt-1 text-small font-medium text-purple">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email ? (
          <p id="email-error" className="mt-1 text-small font-medium text-purple">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="organization">Organization</Label>
        <Input
          id="organization"
          name="organization"
          autoComplete="organization"
          value={values.organization}
          onChange={(event) => updateField("organization", event.target.value)}
        />
      </div>

      <div>
        <Label required>What can I help with?</Label>
        <RadioGroup
          value={values.reason}
          onValueChange={(value) =>
            updateField("reason", value as ContactFormData["reason"])
          }
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? "reason-error" : undefined}
        >
          {CONTACT_REASON_VALUES.map((value) => (
            <RadioGroupItem key={value} value={value} id={`reason-${value}`}>
              {CONTACT_REASON_LABELS[value]}
            </RadioGroupItem>
          ))}
        </RadioGroup>
        {errors.reason ? (
          <p id="reason-error" className="mt-1 text-small font-medium text-purple">
            {errors.reason}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="message" required>
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message ? (
          <p id="message-error" className="mt-1 text-small font-medium text-purple">
            {errors.message}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p role="alert" className="text-small font-medium text-purple">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" variant="primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Start a conversation"}
      </Button>
    </form>
  )
}
