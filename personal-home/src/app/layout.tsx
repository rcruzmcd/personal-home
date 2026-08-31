import type { Metadata } from "next";
import { Inter, Merriweather, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SkipLink } from "@/components/site/skip-link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
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
        <JsonLd data={buildPersonJsonLd()} />
        <JsonLd data={buildWebsiteJsonLd()} />
        <SkipLink />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
