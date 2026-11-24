const STORAGE_KEY = "theme"

export type Theme = "light" | "dark"

const listeners = new Set<() => void>()

export function subscribeTheme(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

export function getThemeSnapshot(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light") return stored
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

// Matches the server-rendered markup (theme is unknown until the client
// reads localStorage), so the first client render doesn't mismatch hydration.
export function getThemeServerSnapshot(): Theme | null {
  return null
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  window.localStorage.setItem(STORAGE_KEY, theme)
  listeners.forEach((listener) => listener())
}

// Re-apply the stored choice to <html>. The inline init script only runs on a
// full page load; a client navigation that remounts the root layout (switching
// locale changes the [locale] root param) makes React clear <html>'s
// attributes, dropping data-theme.
export function restoreTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "dark" || stored === "light") {
      document.documentElement.dataset.theme = stored
    }
  } catch {
    // Storage blocked: nothing was persisted, so there is nothing to restore.
  }
}
