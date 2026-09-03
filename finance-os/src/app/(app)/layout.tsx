import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { NAV_LINKS } from "@/lib/nav";
import { signOut } from "../logout/actions";

export default function AppLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-surface">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          {/* Ten links plus the sign-out button need ~1000px, which no longer
              clears lg (1024px) with the horizontal padding — so the row moves
              to xl. Below that they live in the drawer. */}
          <nav aria-label="Primary" className="hidden xl:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body font-medium text-foreground hover:text-purple transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <MobileNav />
          <form action={signOut}>
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
      {/* Add/edit routes render here as a sheet when reached from inside the
          app; a direct visit or refresh falls through to the full page. */}
      {modal}
    </div>
  );
}
