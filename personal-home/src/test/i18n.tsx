import { render, type RenderOptions } from "@testing-library/react"
import type { ReactElement, ReactNode } from "react"

import { I18nProvider } from "@/components/i18n/i18n-provider"
import { en } from "@/lib/i18n/dictionaries/en"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales"
import { es } from "@/lib/i18n/dictionaries/es"

const MESSAGES: Record<Locale, typeof en.client> = {
  en: en.client,
  es: es.client,
}

/**
 * Renders inside the i18n provider, which anything containing a LocaleLink or
 * a translated client component needs. Defaults to English so existing
 * assertions about English copy keep working unchanged.
 */
export function renderWithI18n(
  ui: ReactElement,
  { locale = DEFAULT_LOCALE, ...options }: RenderOptions & { locale?: Locale } = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <I18nProvider locale={locale} messages={MESSAGES[locale]}>
        {children}
      </I18nProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}
