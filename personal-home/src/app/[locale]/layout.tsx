import type { Metadata } from "next";
import { Inter, Merriweather, Geist_Mono } from "next/font/google";
import { locale as rootLocale } from "next/root-params";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { cn } from "@/lib/utils";
import { SkipLink } from "@/components/site/skip-link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LOCALES, assertLocale } from "@/lib/i18n/locales";
import {
  SITE_NAME,
  SITE_URL,
  buildAlternates,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Read the persisted theme choice before paint so the toggle's preference
// doesn't flash to the system default and then correct itself post-hydration.
// The locale needs no equivalent: it's in the URL, so the server already
// rendered the right language.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.dataset.theme = stored;
    }
  } catch (e) {}
})();
`;

// Both locales prerender at build time; the proxy maps the unprefixed English
// URLs onto the "en" branch.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale());
  const t = await getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: t.common.siteDescription,
    alternates: buildAlternates("/", locale),
  };
}

export default async function RootLayout(props: LayoutProps<"/[locale]">) {
  const locale = assertLocale(await rootLocale());
  const t = await getDictionary(locale);

  return (
    <html
      lang={locale}
      // The theme-init script below sets data-theme before hydration, which
      // intentionally differs from the server-rendered markup (the server
      // can't know the visitor's stored preference) — expected, not a bug.
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable, merriweather.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <JsonLd data={buildPersonJsonLd(locale, t.common.siteDescription)} />
        <JsonLd data={buildWebsiteJsonLd(locale, t.common.siteDescription)} />
        <I18nProvider locale={locale} messages={t.client}>
          <SkipLink label={t.common.skipToContent} />
          <Header />
          {props.children}
          <Footer />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
