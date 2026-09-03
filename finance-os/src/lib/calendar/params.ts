// /calendar's month selection. The month-window logic is shared with every
// other month-scoped screen (/budgets), so it lives in src/lib/month-params.ts
// and this module is just /calendar's binding of it — only the URL is
// route-specific.

import { monthHref, type MonthParams } from "@/lib/month-params";

export {
  currentMonth,
  parseMonthParams,
  shiftMonth,
  monthRange,
  monthDate,
} from "@/lib/month-params";

/** Kept as an alias so existing /calendar imports read in their own vocabulary. */
export type CalendarMonthParams = MonthParams;

/** Single source of truth for /calendar URLs. The current month keeps a clean, query-less URL. */
export function calendarHref(params: CalendarMonthParams, today: Date): string {
  return monthHref("/calendar", params, today);
}
