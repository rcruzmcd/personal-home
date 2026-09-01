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
