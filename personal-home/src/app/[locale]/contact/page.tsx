import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { PageHeader } from "@/components/content/page-header"
import { ContactForm } from "@/components/contact/contact-form"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    alternates: buildAlternates("/contact", locale),
  }
}

export default async function ContactPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))

  return (
    <main id="main-content" className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader title={t.contact.title} description={t.contact.description} />

      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  )
}
