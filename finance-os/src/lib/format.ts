const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatMonths(months: number) {
  if (!Number.isFinite(months)) return "—";
  return `${months.toFixed(1)} months`;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatShortDate(date: Date | null) {
  if (!date) return "—";
  return dateFormatter.format(date);
}

const monthYearFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

export function formatMonthYear(date: Date) {
  return monthYearFormatter.format(date);
}

const PLURAL_RULES = new Intl.PluralRules("en-US", { type: "ordinal" });
const ORDINAL_SUFFIXES: Record<string, string> = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};

/**
 * "1st", "2nd", "3rd", "14th", "31st" — how a stored day-of-month
 * (accounts.due_day / accounts.statement_day) reads in prose. Intl handles the
 * 11th/12th/13th exception rather than hand-rolled modulo rules.
 */
export function formatDayOfMonth(day: number) {
  return `${day}${ORDINAL_SUFFIXES[PLURAL_RULES.select(day)] ?? "th"}`;
}
