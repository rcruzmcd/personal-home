import { MonthNav as MonthNavBase } from "@/components/month-nav";
import { calendarHref, type CalendarMonthParams } from "@/lib/calendar/params";
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
 * /calendar's month selection: the shared MonthNav bound to calendar URLs,
 * with the event-kind legend in its trailing slot.
 */
export function MonthNav({ params, today }: { params: CalendarMonthParams; today: Date }) {
  return (
    <MonthNavBase
      params={params}
      today={today}
      href={(next) => calendarHref(next, today)}
      trailing={
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {CALENDAR_EVENT_KINDS.map((kind) => (
            <li key={kind} className="flex items-center gap-1.5 text-small text-muted">
              <span aria-hidden className={`size-2 rounded-full ${KIND_SWATCH[kind]}`} />
              <span title={KIND_LABEL[kind]}>{LEGEND_LABEL[kind]}</span>
            </li>
          ))}
        </ul>
      }
    />
  );
}
