// Cadence/merchant-identity helpers shared by the recurring-expense
// detector (alerts.ts) and the recurring-expense matcher
// (src/lib/recurring/matching.ts) — kept here, decoupled from Supabase rows,
// so both are testable without a database (docs/PERSONAL_FINANCE_REQUIREMENTS.md
// §10 "Later: Auto-detect based on patterns").

import type { RecurringFrequency } from "./types";
import { AVG_DAYS_PER_MONTH, MS_PER_DAY } from "./date-math";

/**
 * Normalizes a merchant string so the same biller groups together across
 * statement-format noise — e.g. "SQ *COFFEE SHOP #482" and
 * "SQ *COFFEE SHOP #119" should read as the same merchant, as should
 * "NETFLIX.COM" and "Netflix.com".
 */
export function normalizeMerchant(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^(sq|tst|sp|paypal)\s*\*\s*/i, "")
    .replace(/[*#]\s*[a-z0-9-]+$/i, "")
    .replace(/\s+\d{3,}$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

type CadenceBand = { frequency: RecurringFrequency; expectedDays: number; toleranceDays: number };

const CADENCE_BANDS: readonly CadenceBand[] = [
  { frequency: "daily", expectedDays: 1, toleranceDays: 0.5 },
  { frequency: "weekly", expectedDays: 7, toleranceDays: 2 },
  { frequency: "monthly", expectedDays: AVG_DAYS_PER_MONTH, toleranceDays: 5 },
  { frequency: "annually", expectedDays: 365.25, toleranceDays: 15 },
];

export function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Infers a recurring cadence from occurrence dates (ascending, ISO
 * "yyyy-mm-dd"). Uses the median gap between consecutive dates so one
 * skipped or doubled charge doesn't throw off the read, then requires
 * every gap to land within that cadence's tolerance band — an irregular
 * series (e.g. sporadic coffee-shop visits) returns null rather than a
 * false cadence.
 */
export function inferFrequency(sortedDates: readonly string[]): RecurringFrequency | null {
  if (sortedDates.length < 3) return null;

  const deltas: number[] = [];
  for (let i = 1; i < sortedDates.length; i++) {
    const days =
      (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / MS_PER_DAY;
    deltas.push(days);
  }

  const band = CADENCE_BANDS.find(
    (b) => Math.abs(median(deltas) - b.expectedDays) <= b.toleranceDays,
  );
  if (!band) return null;

  const allWithinBand = deltas.every((d) => Math.abs(d - band.expectedDays) <= band.toleranceDays);
  return allWithinBand ? band.frequency : null;
}
