import Link from "next/link";
import { iconActionClasses } from "@/components/ui/icon-action";
import { pillVariant } from "@/components/ui/pill";
import { monthName } from "@/lib/transactions/periods";
import {
  calendarHref,
  currentMonth,
  shiftMonth,
  type CalendarMonthParams,
} from "@/lib/calendar/params";
import { CALENDAR_EVENT_KINDS, type CalendarEventKind } from "@/lib/calculations";
import { KIND_LABEL } from "./event-chip";

// Matches EventChip's per-kind border so the legend and the chips read as one
// system.
const KIND_SWATCH: Record<CalendarEventKind, string> = {
  due: "bg-purple",
  statement: "bg-border",
  recurring: "bg-foreground",
  income: "bg-green",
};

const LEGEND_LABEL: Record<CalendarEventKind, string> = {
  due: "Due",
  statement: "Closes",
  recurring: "Recurring",
  income: "Income",
};

/**
 * Month selection, rendered as links rather than stateful controls so a month
 * is bookmarkable and server-filtered — the same approach as the transaction
 * list's PeriodNav.
 *
 * The legend is pushed to the far end: it describes the grid rather than
 * filtering it (docs/UX_PATTERNS.md rule 3 keeps those apart).
 */
export function MonthNav({
  params,
  today,
}: {
  params: CalendarMonthParams;
  today: Date;
}) {
  const now = currentMonth(today);
  const onCurrentMonth = params.year === now.year && params.month === now.month;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
      <div className="flex items-center gap-2">
        <Link
          href={calendarHref(shiftMonth(params, -1), today)}
          className={iconActionClasses}
          aria-label="Previous month"
        >
          ‹
        </Link>
        <p className="min-w-44 text-center text-h4 font-semibold text-foreground">
          {monthName(params.month)} {params.year}
        </p>
        <Link
          href={calendarHref(shiftMonth(params, 1), today)}
          className={iconActionClasses}
          aria-label="Next month"
        >
          ›
        </Link>
        {/* On the current month this link leads where you already are, so it
            carries no information (rule 5) and is dropped. */}
        {!onCurrentMonth && (
          <Link href={calendarHref(now, today)} className={pillVariant(false, "ml-1")}>
            Today
          </Link>
        )}
      </div>

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {CALENDAR_EVENT_KINDS.map((kind) => (
          <li key={kind} className="flex items-center gap-1.5 text-small text-muted">
            <span
              aria-hidden
              className={`size-2 rounded-full ${KIND_SWATCH[kind]}`}
            />
            <span title={KIND_LABEL[kind]}>{LEGEND_LABEL[kind]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
