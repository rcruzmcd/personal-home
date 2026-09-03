/**
 * Parses a Postgres `date` column value (`YYYY-MM-DD`) as **local** midnight.
 *
 * `new Date("2026-08-31")` parses as *UTC* midnight, which is still 2026-08-30
 * anywhere west of Greenwich. That makes a date-only value land a day early
 * whenever it's formatted for display or compared against a Date built from
 * local parts (`new Date(y, m, d)`, or anything derived from "now") — a
 * statement dated the 31st reads as the 30th, and "entered through the 31st"
 * compares as earlier than "the end of August".
 *
 * Only for values that carry no time. Timestamps (`created_at`, `last_updated`)
 * are instants and must keep using `new Date()`.
 */
export function parseDateOnly(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  // Anything else (a full timestamp, a malformed value) is left to the
  // platform parser rather than silently turned into an Invalid Date here.
  if (!match) return new Date(value);
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Local midnight of the day `date` falls on.
 *
 * Date-only comparisons in this app all happen at local-midnight granularity
 * (see parseDateOnly). Callers that pass "now" hand in a Date carrying a
 * time-of-day, which would otherwise compare as *later* than the same
 * calendar day parsed from a date column.
 */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
