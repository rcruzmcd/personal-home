"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/nav";

/**
 * The primary navigation below `xl`, where the ten links plus the sign-out
 * button overflow the header bar. Mirrors personal-home's MobileNav (a Sheet behind a
 * hamburger) so both apps behave the same way on a phone.
 *
 * The only client state is whether the drawer is open — the links themselves
 * are plain server-rendered anchors, and navigating closes the drawer so the
 * destination isn't hidden behind it.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="secondary" className="px-3 py-3 xl:hidden" aria-label="Open menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>Menu</SheetTitle>
        <nav aria-label="Primary" className="flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-body font-medium text-foreground hover:text-purple transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
