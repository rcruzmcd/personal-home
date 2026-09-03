import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/ui/stat";
import { formatCurrency } from "@/lib/format";
import { monthName } from "@/lib/transactions/periods";
import { parseMonthParams } from "@/lib/calendar/params";
import {
  buildMonthEvents,
  buildMonthGrid,
  monthWindow,
  sumEventAmounts,
  type CalendarAccount,
  type CalendarIncomeSource,
  type CalendarRecurringExpense,
} from "@/lib/calculations";
import { MonthNav } from "./month-nav";
import { MonthGrid } from "./month-grid";
import { AgendaList } from "./agenda-list";

export default async function CalendarPage({ searchParams }: PageProps<"/calendar">) {
  const today = new Date();
  const params = parseMonthParams(await searchParams, today);
  const window = monthWindow(params.year, params.month);

  const supabase = await createClient();
  // No date filtering in SQL: a monthly recurring expense anchored in October
  // still falls due in September, so which rows land in the window is the pure
  // occurrence layer's decision, not PostgREST's. These tables hold tens of
  // rows, not thousands.
  const [{ data: accounts }, { data: recurringExpenses }, { data: incomeSources }] =
    await Promise.all([
      supabase
        .from("accounts")
        .select("id, name, active, due_day, statement_day, minimum_payment")
        .eq("active", true),
      supabase
        .from("recurring_expenses")
        .select("id, name, amount, frequency, next_date, active")
        .eq("active", true),
      supabase
        .from("income_sources")
        .select("id, name, amount, frequency, expected_date, start_date, end_date"),
    ]);

  const events = buildMonthEvents({
    accounts: (accounts ?? []) as CalendarAccount[],
    recurringExpenses: (recurringExpenses ?? []) as CalendarRecurringExpense[],
    incomeSources: (incomeSources ?? []) as CalendarIncomeSource[],
    window,
  });
  const days = buildMonthGrid(window, events, today);
  const monthLabel = `${monthName(params.month)} ${params.year}`;

  // Nothing anywhere carries a date yet — a different situation from a month
  // that happens to be empty, and it needs the way out rather than a grid.
  const hasAnySource =
    (accounts ?? []).some((account) => account.due_day || account.statement_day) ||
    (recurringExpenses ?? []).length > 0 ||
    (incomeSources ?? []).length > 0;

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        title="Calendar"
        description={`${events.length} ${events.length === 1 ? "date" : "dates"} in ${monthLabel}`}
        stats={
          // Three figures rather than one "money out" total: the same
          // obligation can be both an account's minimum payment and a tracked
          // recurring expense, so combining them would double-count it.
          <>
            <Stat
              label="Minimum payments"
              value={formatCurrency(sumEventAmounts(events, "due"))}
            />
            <Stat label="Recurring" value={formatCurrency(sumEventAmounts(events, "recurring"))} />
            <Stat
              label="Income expected"
              value={formatCurrency(sumEventAmounts(events, "income"))}
              tone="positive"
            />
          </>
        }
      />

      {!hasAnySource ? (
        <p className="text-body text-muted">
          Nothing to put on the calendar yet. Add a due day to an{" "}
          <Link href="/accounts" className="font-medium text-purple underline">
            account
          </Link>
          , or track a{" "}
          <Link href="/recurring/new" className="font-medium text-purple underline">
            recurring expense
          </Link>
          .
        </p>
      ) : (
        <>
          <MonthNav params={params} today={today} />
          <MonthGrid days={days} />
          <AgendaList days={days} />
          {events.length === 0 && (
            <p className="text-body text-muted">Nothing scheduled in {monthLabel}.</p>
          )}
        </>
      )}
    </main>
  );
}
