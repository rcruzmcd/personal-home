import { describe, expect, test } from "vitest"

// Mirrors the token values in src/app/globals.css. If you change a token
// there, update it here too — this test exists specifically to catch a
// contrast regression (e.g. reverting a token to docs/BRAND_GUIDE.md's
// original literal value, which fails WCAG AA — see the comments in
// globals.css next to --muted, --purple-solid, and --green-solid).
const LIGHT = {
  background: "#f4f6f9",
  surface: "#ffffff",
  muted: "#6c717a",
  purpleSolid: "#5d3a7a",
  greenSolid: "#2d7a4a",
}

const DARK = {
  background: "#0f1117",
  surface: "#1c1f26",
  muted: "#7e8697",
  purple: "#9b7ac9",
  green: "#5fb876",
  // purple-solid / green-solid are theme-independent (always the light
  // values above), used for solid fills that carry white text.
}

const WHITE = "#ffffff"
const WCAG_AA_NORMAL_TEXT = 4.5

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ]
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const channel = c / 255
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hexToRgb(hex1))
  const l2 = relativeLuminance(hexToRgb(hex2))
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (lighter + 0.05) / (darker + 0.05)
}

describe("brand token contrast (WCAG AA, normal text = 4.5:1)", () => {
  test("light-mode muted text passes against both background and surface", () => {
    expect(contrastRatio(LIGHT.muted, LIGHT.background)).toBeGreaterThanOrEqual(
      WCAG_AA_NORMAL_TEXT
    )
    expect(contrastRatio(LIGHT.muted, LIGHT.surface)).toBeGreaterThanOrEqual(
      WCAG_AA_NORMAL_TEXT
    )
  })

  test("dark-mode muted text passes against both background and surface", () => {
    expect(contrastRatio(DARK.muted, DARK.background)).toBeGreaterThanOrEqual(
      WCAG_AA_NORMAL_TEXT
    )
    expect(contrastRatio(DARK.muted, DARK.surface)).toBeGreaterThanOrEqual(
      WCAG_AA_NORMAL_TEXT
    )
  })

  test("white text on the fixed purple/green solid fills passes in both themes", () => {
    // These fills (button primary, featured/active badges) don't change
    // between themes — that's the point: the theme-adaptive --purple/--green
    // values are too light in dark mode for white text on top of them.
    expect(contrastRatio(WHITE, LIGHT.purpleSolid)).toBeGreaterThanOrEqual(
      WCAG_AA_NORMAL_TEXT
    )
    expect(contrastRatio(WHITE, LIGHT.greenSolid)).toBeGreaterThanOrEqual(
      WCAG_AA_NORMAL_TEXT
    )
  })

  test("white text on the theme-adaptive dark-mode purple/green fails (documents why *-solid exists)", () => {
    expect(contrastRatio(WHITE, DARK.purple)).toBeLessThan(WCAG_AA_NORMAL_TEXT)
    expect(contrastRatio(WHITE, DARK.green)).toBeLessThan(WCAG_AA_NORMAL_TEXT)
  })

  test("purple/green as text color (not fill) pass against dark backgrounds", () => {
    expect(contrastRatio(DARK.purple, DARK.background)).toBeGreaterThanOrEqual(
      WCAG_AA_NORMAL_TEXT
    )
    expect(contrastRatio(DARK.green, DARK.background)).toBeGreaterThanOrEqual(
      WCAG_AA_NORMAL_TEXT
    )
  })
})
