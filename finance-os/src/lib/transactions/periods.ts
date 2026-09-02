// Timeframe helpers for the account-scoped transaction list: turning the
// flat year/month buckets returned by the transaction_periods() RPC into the
// year → months tree the period navigation renders, and grouping a page of
// rows under month headings. Pure so both are testable without a DOM or a
// database.

export type PeriodBucket = { year: number; month: number; transaction_count: number };

export type MonthPeriod = { month: number; count: number };
export type YearPeriod = { year: number; count: number; months: MonthPeriod[] };

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? "";
}

export function shortMonthName(month: number): string {
  return monthName(month).slice(0, 3);
}

/**
 * Human label for the selected timeframe, used in the account header so the
 * net total on screen always says which period it covers.
 */
export function periodLabel(year: number | null, month: number | null): string {
  if (year === null) return "All time";
  if (month === null) return String(year);
  return `${shortMonthName(month)} ${year}`;
}

/**
 * Collapses flat (year, month, count) buckets into years — each with its own
 * months. Years come back newest first, the way a statement archive reads;
 * months stay in calendar order, since they render as a Jan → Dec tab strip.
 */
export function buildPeriodTree(buckets: PeriodBucket[]): YearPeriod[] {
  const years = new Map<number, YearPeriod>();

  for (const bucket of buckets) {
    let year = years.get(bucket.year);
    if (!year) {
      year = { year: bucket.year, count: 0, months: [] };
      years.set(bucket.year, year);
    }
    year.count += bucket.transaction_count;

    const existingMonth = year.months.find((m) => m.month === bucket.month);
    if (existingMonth) existingMonth.count += bucket.transaction_count;
    else year.months.push({ month: bucket.month, count: bucket.transaction_count });
  }

  const sorted = [...years.values()].sort((a, b) => b.year - a.year);
  for (const year of sorted) year.months.sort((a, b) => a.month - b.month);
  return sorted;
}
