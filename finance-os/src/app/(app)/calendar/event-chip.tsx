import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { CalendarEvent, CalendarEventKind } from "@/lib/calculations";

// The theme carries only purple and green accents (no red/amber), so kinds are
// told apart by a left border plus wording rather than by colour alone — and
// every chip repeats its meaning in an accessible label, so colour is never the
// only signal.
const KIND_BORDER: Record<CalendarEventKind, string> = {
  // A bill with a due date is the thing this page exists for, so it also
  // carries weight — the one non-colour signal available. It matters because a
  // debt can legitimately be tracked twice (an account's minimum payment *and*
  // a recurring expense), and two same-named chips on one day would otherwise
  // be indistinguishable from a duplicate.
  due: "border-l-purple font-medium",
  statement: "border-l-border text-muted",
  recurring: "border-l-foreground",
  income: "border-l-green text-green",
};

export const KIND_LABEL: Record<CalendarEventKind, string> = {
  due: "Payment due",
  statement: "Statement closes",
  recurring: "Recurring",
  income: "Income",
};

export function EventChip({ event }: { event: CalendarEvent }) {
  const amount = event.amount === null ? "" : ` ${formatCurrency(event.amount)}`;
  const description = `${KIND_LABEL[event.kind]}: ${event.label}${amount} on ${formatShortDate(event.date)}`;

  const className = cn(
    "flex items-baseline gap-1 rounded-sm border-l-2 bg-background px-1.5 py-0.5 text-label",
    KIND_BORDER[event.kind],
  );

  // In a cell wide enough for both, the amount holds its width and the label
  // truncates around it. In a narrow one it would win by crushing the label to
  // an initial ("H… $195.00" says nothing), so below the threshold the amount
  // drops out and the name — the part that identifies the bill — gets the room.
  // Either way the full text stays in the tooltip and the accessible name.
  // The container is the day cell (MonthGrid) or the day group (AgendaList).
  const content = (
    <>
      <span className="min-w-0 truncate">{event.label}</span>
      {event.amount !== null && (
        <span className="ml-auto hidden shrink-0 tabular-nums @min-[10rem]:inline">
          {formatCurrency(event.amount)}
        </span>
      )}
    </>
  );

  if (!event.href) {
    return (
      <span className={className} title={description} aria-label={description}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={event.href}
      className={cn(className, "hover:bg-border transition-colors duration-200")}
      title={description}
      aria-label={description}
    >
      {content}
    </Link>
  );
}
