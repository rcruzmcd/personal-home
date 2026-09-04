"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavLinks } from "@/components/site/nav-links"
import { LocaleSwitcher } from "@/components/i18n/locale-switcher"
import { useMessages } from "@/components/i18n/i18n-provider"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const messages = useMessages()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-3 md:hidden"
          aria-label={messages.mobileNav.open}
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" closeLabel={messages.mobileNav.close}>
        <SheetTitle>{messages.mobileNav.title}</SheetTitle>
        <nav aria-label={messages.nav.ariaLabel}>
          <NavLinks
            className="flex flex-col gap-4"
            linkClassName="text-body"
            onNavigate={() => setOpen(false)}
          />
        </nav>
        <LocaleSwitcher className="mt-6 md:hidden" />
      </SheetContent>
    </Sheet>
  )
}
