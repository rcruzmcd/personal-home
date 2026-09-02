import Link from "next/link";
import { pillVariant } from "@/components/ui/pill";
import { cn } from "@/lib/utils";
import {
  transactionListHref,
  type TransactionListParams,
} from "@/lib/transactions/list-params";
import { shortMonthName, type YearPeriod } from "@/lib/transactions/periods";

// Months are a fixed calendar axis, so they read as tabs along the top of
// the list rather than as another row of pills.
function monthTabClasses(active: boolean) {
  return cn(
    "-mb-px border-b-2 px-3 py-2 text-small font-medium whitespace-nowrap transition-colors duration-200",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
    active
      ? "border-purple text-purple"
      : "border-transparent text-muted hover:text-purple hover:border-border",
  );
}

/**
 * Year → month timeframe navigation for the account transaction list.
 * Rendered as links (not stateful tabs) so a timeframe is bookmarkable and
 * server-filtered, and only periods that actually have transactions under
 * the current search are offered.
 */
export function PeriodNav({
  accountId,
  params,
  years,
}: {
  accountId: string;
  params: TransactionListParams;
  years: YearPeriod[];
}) {
  if (years.length === 0) return null;

  // With a single year on file the year pills carry no information — every
  // count would be identical to "All years" — so that row is dropped and its
  // months become the only timeframe axis.
  const singleYear = years.length === 1 ? years[0] : null;
  const selectedYear = years.find((year) => year.year === params.year) ?? singleYear;
  const totalCount = years.reduce((sum, year) => sum + year.count, 0);

  // Changing the timeframe resets paging; the search and sort carry over.
  const href = (year: number | null, month: number | null) =>
    transactionListHref(accountId, { ...params, page: 1, year, month });

  return (
    <div className="flex flex-col gap-3">
      {!singleYear && (
        <div className="flex flex-wrap items-center gap-2">
          <Link href={href(null, null)} className={pillVariant(params.year === null)}>
            All years
            <PillCount count={totalCount} active={params.year === null} />
          </Link>
          {years.map((year) => (
            <Link
              key={year.year}
              href={href(year.year, null)}
              className={pillVariant(params.year === year.year)}
            >
              {year.year}
              <PillCount count={year.count} active={params.year === year.year} />
            </Link>
          ))}
        </div>
      )}

      {selectedYear && (
        <div
          role="tablist"
          aria-label={`Months in ${selectedYear.year}`}
          className="flex items-center gap-1 overflow-x-auto border-b border-border"
        >
          <Link
            role="tab"
            aria-selected={params.month === null}
            href={href(selectedYear.year, null)}
            className={monthTabClasses(params.month === null)}
          >
            All {selectedYear.year}
          </Link>
          {selectedYear.months.map((month) => (
            <Link
              key={month.month}
              role="tab"
              aria-selected={params.month === month.month}
              href={href(selectedYear.year, month.month)}
              className={monthTabClasses(params.month === month.month)}
            >
              {shortMonthName(month.month)}
              <span className="ml-1.5 text-muted">{month.count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function PillCount({ count, active }: { count: number; active: boolean }) {
  return <span className={active ? "text-white/70" : "text-muted"}>{count}</span>;
}
