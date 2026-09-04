import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { Button } from "@/components/ui/button"
import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary(assertLocale(await rootLocale()))

  return {
    title: t.notFound.metaTitle,
    robots: { index: false, follow: true },
  }
}

export default async function NotFound() {
  const t = await getDictionary(assertLocale(await rootLocale()))

  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        eyebrow={t.notFound.eyebrow}
        title={t.notFound.title}
        description={t.notFound.description}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild variant="primary">
          <LocaleLink href="/">{t.notFound.backHome}</LocaleLink>
        </Button>
        <Button asChild variant="secondary">
          <LocaleLink href="/work">{t.notFound.viewWork}</LocaleLink>
        </Button>
      </div>
    </main>
  )
}
