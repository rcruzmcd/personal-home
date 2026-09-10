import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { PageHeader } from "@/components/content/page-header"
import { ContactForm } from "@/components/contact/contact-form"
import { PageShell } from "@/components/site/page-shell"
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
    <PageShell id="main-content">
      <PageHeader title={t.contact.title} description={t.contact.description} />

      {/* The form keeps its own column: full-width text inputs at the shell
          width are hard to scan (docs/UX_PATTERNS.md). */}
      <div className="mt-8 max-w-2xl">
        <ContactForm />
      </div>
    </PageShell>
  )
}
