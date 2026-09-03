// Month selection for any screen whose content is scoped to one calendar month
// — /calendar and /budgets today. Route plumbing rather than finance math, so
// it lives here rather than in src/lib/calculations, the same split as
// src/lib/transactions/list-params.ts.
//
// The month lives in the URL (not client state) so a month is bookmarkable,
// server-rendered and survives Back, matching the transaction period nav.

/** `month` is 1-12, matching monthWindow() and src/lib/transactions/periods.ts. */
export type MonthParams = { year: number; month: number };

// Next 16's searchParams values come back as string | string[] | undefined
// (same normalizer shape as transactions/list-params.ts).
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseIntInRange(raw: string | undefined, min: number, max: number): number | null {
  const value = Number(raw);
  if (!raw || !Number.isInteger(value) || value < min || value > max) return null;
  return value;
}

export function currentMonth(today: Date): MonthParams {
  return { year: today.getFullYear(), month: today.getMonth() + 1 };
}

/**
 * The selected month, defaulting to today's. A partial or out-of-range pair
 * falls back rather than 404ing — a mistyped URL should still show a screen.
 */
export function parseMonthParams(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  today: Date,
): MonthParams {
  const year = parseIntInRange(first(searchParams?.y), 1900, 2999);
  // A month without a year can't identify a window, so it's dropped rather
  // than silently applied to the current year.
  const month = year === null ? null : parseIntInRange(first(searchParams?.m), 1, 12);
  if (year === null || month === null) return currentMonth(today);
  return { year, month };
}

/** Builds a month URL for `basePath`. The current month keeps a clean, query-less URL. */
export function monthHref(basePath: string, params: MonthParams, today: Date): string {
  const now = currentMonth(today);
  if (params.year === now.year && params.month === now.month) return basePath;
  return `${basePath}?y=${params.year}&m=${params.month}`;
}

/** Steps whole calendar months, rolling the year over as needed. */
export function shiftMonth(params: MonthParams, delta: number): MonthParams {
  // Date normalizes an out-of-range month index across the year boundary.
  const shifted = new Date(params.year, params.month - 1 + delta, 1);
  return { year: shifted.getFullYear(), month: shifted.getMonth() + 1 };
}

/** First and last day of the month, as "yyyy-mm-dd" — the bounds every month-scoped query takes. */
export function monthRange(params: MonthParams): { start: string; end: string } {
  const pad = (n: number) => String(n).padStart(2, "0");
  const lastDay = new Date(params.year, params.month, 0).getDate();
  return {
    start: `${params.year}-${pad(params.month)}-01`,
    end: `${params.year}-${pad(params.month)}-${pad(lastDay)}`,
  };
}

/** A Date inside the selected month, for calculations that take one. */
export function monthDate(params: MonthParams): Date {
  return new Date(params.year, params.month - 1, 1);
}
