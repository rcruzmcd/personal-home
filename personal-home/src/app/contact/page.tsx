import type { Metadata } from "next"

import { AccentBar } from "@/components/ui/accent-bar"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation about consulting, a project, or a question.",
}

export default function ContactPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <AccentBar width="md" className="mb-6" />
      <h1 className="text-h1 font-bold text-purple">Get in touch</h1>
      <p className="mt-4 text-body text-foreground">
        Whether it&apos;s a consulting question, a project idea, or something else entirely —
        tell me a bit about it below.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  )
}
