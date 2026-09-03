import Link from "next/link";
import type { ReactNode } from "react";
import { iconActionClasses } from "@/components/ui/icon-action";
import { pillVariant } from "@/components/ui/pill";
import { monthName } from "@/lib/transactions/periods";
import { currentMonth, shiftMonth, type MonthParams } from "@/lib/month-params";

/**
 * Month selection for any month-scoped screen (/calendar, /budgets), rendered
 * as links rather than stateful controls so a month is bookmarkable and
 * server-filtered — the same approach as the transaction list's PeriodNav.
 *
 * `href` is the only route-specific part, so each screen supplies its own URL
 * builder and the control itself stays shared.
 *
 * `trailing` is a slot for whatever describes the screen's content rather than
 * filtering it (the calendar's legend), pushed to the far end because
 * docs/UX_PATTERNS.md rule 3 keeps those apart from the filter controls.
 */
export function MonthNav({
  params,
  today,
  href,
  trailing,
}: {
  params: MonthParams;
  today: Date;
  href: (params: MonthParams) => string;
  trailing?: ReactNode;
}) {
  const now = currentMonth(today);
  const onCurrentMonth = params.year === now.year && params.month === now.month;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
      <div className="flex items-center gap-2">
        <Link href={href(shiftMonth(params, -1))} className={iconActionClasses} aria-label="Previous month">
          ‹
        </Link>
        <p className="min-w-44 text-center text-h4 font-semibold text-foreground">
          {monthName(params.month)} {params.year}
        </p>
        <Link href={href(shiftMonth(params, 1))} className={iconActionClasses} aria-label="Next month">
          ›
        </Link>
        {/* On the current month this link leads where you already are, so it
            carries no information (rule 5) and is dropped. */}
        {!onCurrentMonth && (
          <Link href={href(now)} className={pillVariant(false, "ml-1")}>
            Today
          </Link>
        )}
      </div>
      {trailing}
    </div>
  );
}
