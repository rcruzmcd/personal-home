import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/lib/calculations";
import { EventChip } from "./event-chip";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Beyond this a cell would grow taller than its neighbours and break the grid's
// rhythm; the overflow is still reachable through the mobile agenda and the
// source pages the chips link to.
const MAX_CHIPS_PER_DAY = 3;

/**
 * The month as a 7-column grid. Plain CSS grid rather than a date-picker
 * library — this renders a fixed set of server-built cells and never needs to
 * handle selection.
 *
 * Hidden below `sm`, where seven columns stop being legible; AgendaList covers
 * that width from the same CalendarDay[].
 */
export function MonthGrid({ days }: { days: CalendarDay[] }) {
  return (
    <div className="hidden sm:block overflow-hidden rounded-xl border border-border bg-surface">
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="px-2 py-2 text-center text-label font-medium text-muted">
            {weekday}
          </div>
        ))}
      </div>
      {/* Each cell draws its own top/left rule; the first column drops its left
          one so the container's border isn't doubled. */}
      <div className="grid grid-cols-7 [&>*:nth-child(7n+1)]:border-l-0">
        {days.map((day) => (
          <div
            key={day.date.toISOString()}
            className={cn(
              "@container flex min-h-28 flex-col gap-1 border-t border-l border-border p-2",
              !day.inMonth && "bg-background",
              day.isPast && day.inMonth && "opacity-60",
            )}
          >
            <span
              className={cn(
                "text-label",
                day.isToday
                  ? // purple-solid, not purple: the token stays dark in both
                    // themes, which is what white text needs on top of it.
                    "inline-flex size-6 items-center justify-center rounded-full bg-purple-solid font-semibold text-white"
                  : day.inMonth
                    ? "text-foreground"
                    : "text-muted",
              )}
            >
              {day.date.getDate()}
            </span>
            {day.events.slice(0, MAX_CHIPS_PER_DAY).map((event) => (
              <EventChip key={event.id} event={event} />
            ))}
            {day.events.length > MAX_CHIPS_PER_DAY && (
              <span className="text-label text-muted">
                +{day.events.length - MAX_CHIPS_PER_DAY} more
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
