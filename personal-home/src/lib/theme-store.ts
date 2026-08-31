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
