import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/lib/calculations";
import { EventChip } from "./event-chip";

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const dayFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

/**
 * The narrow-screen view of the same month. Seven columns are unreadable below
 * ~640px and a horizontally scrolling grid reads worse than a list, so the days
 * that actually carry events become an agenda.
 *
 * Takes the same CalendarDay[] the grid does, so the two can't disagree.
 */
export function AgendaList({ days }: { days: CalendarDay[] }) {
  const scheduled = days.filter((day) => day.inMonth && day.events.length > 0);

  if (scheduled.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 sm:hidden">
      {scheduled.map((day) => (
        <div key={day.date.toISOString()} className={cn("@container flex flex-col gap-1.5", day.isPast && "opacity-60")}>
          <p className="text-small font-medium text-foreground">
            {dayFormatter.format(day.date)}
            <span className="font-normal text-muted"> · {weekdayFormatter.format(day.date)}</span>
            {day.isToday && <span className="text-purple"> · Today</span>}
          </p>
          {day.events.map((event) => (
            <EventChip key={event.id} event={event} />
          ))}
        </div>
      ))}
    </div>
  );
}
