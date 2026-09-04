"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useMessages } from "@/components/i18n/i18n-provider"
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
  type Theme,
} from "@/lib/theme-store"

export function ThemeToggle() {
  const messages = useMessages()
  const theme = React.useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  )

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
  }

  const isDark = theme === "dark"

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={toggle}
      aria-label={isDark ? messages.themeToggle.toLight : messages.themeToggle.toDark}
      className="px-3 py-3"
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </Button>
  )
}
