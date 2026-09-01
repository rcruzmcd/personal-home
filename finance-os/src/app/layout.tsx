import type { Metadata } from "next";
import { Inter, Merriweather, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

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
  title: "Personal Finance OS",
  description: "Cash runway, net worth, debt payoff, and forecasting.",
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
        {children}
      </body>
    </html>
  );
}
