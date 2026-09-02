import type { Metadata } from "next"

import { PageHeader } from "@/components/content/page-header"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation about consulting, a project, or a question.",
}

export default function ContactPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title="Get in touch"
        description="Whether it's a consulting question, a project idea, or something else entirely — tell me a bit about it below."
      />

      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  )
}
