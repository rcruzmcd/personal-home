// Shared date constants/helpers for the calculation engine. A fixed
// 365.2425 / 12 average is used instead of a calendar-accurate "add one
// month" everywhere a month-length constant is needed for something other
// than stepping actual calendar periods (see cash-runway.ts and
// forecast.ts) — it keeps duration math (e.g. "3 months ago") consistent
// regardless of which calendar months it crosses.
export const AVG_DAYS_PER_MONTH = 30.4368;
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Adds calendar months (not the AVG_DAYS_PER_MONTH approximation) — used to step actual monthly periods. */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Half-open date range: [start, end). Lives here rather than in income.ts so
 * every module that windows over dates (income projection, recurring/income
 * occurrence expansion, the calendar) shares one definition without importing
 * each other.
 */
export type Period = { start: Date; end: Date };
