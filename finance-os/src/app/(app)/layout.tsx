import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "../logout/actions";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
  { href: "/transactions", label: "Transactions" },
  { href: "/income", label: "Income" },
  { href: "/recurring", label: "Recurring" },
  { href: "/forecast", label: "Forecast" },
  { href: "/inbox", label: "Inbox" },
];

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-surface">
        <div className="flex items-center justify-between px-10 py-4">
          <nav className="flex items-center gap-6">
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
          <form action={signOut}>
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
