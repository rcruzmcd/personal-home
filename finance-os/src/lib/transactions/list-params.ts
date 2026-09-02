// Pagination/sort/filter state for the account-scoped transaction list
// (transactions/account/[accountId]/page.tsx). Kept pure and separate from
// the page so it's testable without a DOM or a database.

export const TRANSACTION_LIST_PAGE_SIZES = [10, 25, 50] as const;
export const TRANSACTION_LIST_SORTS = ["date", "amount"] as const;
export const TRANSACTION_LIST_DIRECTIONS = ["asc", "desc"] as const;

export type TransactionListPageSize = (typeof TRANSACTION_LIST_PAGE_SIZES)[number];
export type TransactionListSort = (typeof TRANSACTION_LIST_SORTS)[number];
export type TransactionListDirection = (typeof TRANSACTION_LIST_DIRECTIONS)[number];

export type TransactionListParams = {
  page: number;
  pageSize: TransactionListPageSize;
  sort: TransactionListSort;
  dir: TransactionListDirection;
  /** Free-text search matched against the transaction description. */
  q: string;
  /** Timeframe filter. `month` is only meaningful alongside a `year`. */
  year: number | null;
  month: number | null;
};

const DEFAULTS: TransactionListParams = {
  page: 1,
  pageSize: 10,
  sort: "date",
  dir: "desc",
  q: "",
  year: null,
  month: null,
};

// Next 16's searchParams values come back as string | string[] | undefined
// (same normalizer shape as recurring/new/page.tsx).
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseIntInRange(raw: string | undefined, min: number, max: number): number | null {
  const value = Number(raw);
  if (!raw || !Number.isInteger(value) || value < min || value > max) return null;
  return value;
}

export function parseTransactionListParams(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): TransactionListParams {
  const pageRaw = Number(first(searchParams?.page));
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : DEFAULTS.page;

  const pageSizeRaw = Number(first(searchParams?.pageSize));
  const pageSize = (TRANSACTION_LIST_PAGE_SIZES as readonly number[]).includes(pageSizeRaw)
    ? (pageSizeRaw as TransactionListPageSize)
    : DEFAULTS.pageSize;

  const sortRaw = first(searchParams?.sort);
  const sort = (TRANSACTION_LIST_SORTS as readonly string[]).includes(sortRaw ?? "")
    ? (sortRaw as TransactionListSort)
    : DEFAULTS.sort;

  const dirRaw = first(searchParams?.dir);
  const dir = (TRANSACTION_LIST_DIRECTIONS as readonly string[]).includes(dirRaw ?? "")
    ? (dirRaw as TransactionListDirection)
    : DEFAULTS.dir;

  const q = (first(searchParams?.q) ?? "").trim();

  const year = parseIntInRange(first(searchParams?.year), 1900, 2999);
  // A month on its own can't be turned into a date range, so it's dropped
  // rather than silently applied across every year.
  const month = year === null ? null : parseIntInRange(first(searchParams?.month), 1, 12);

  return { page, pageSize, sort, dir, q, year, month };
}

// Single source of truth for /transactions/account/[id] URLs, used by both
// the server-rendered Prev/Next links and the client controls so the query
// shape can never drift between the two. Filters are omitted when unset so
// the default view keeps a clean URL.
export function transactionListHref(
  accountId: string,
  params: TransactionListParams,
): string {
  const qs = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sort: params.sort,
    dir: params.dir,
  });
  if (params.q) qs.set("q", params.q);
  if (params.year !== null) {
    qs.set("year", String(params.year));
    if (params.month !== null) qs.set("month", String(params.month));
  }
  return `/transactions/account/${accountId}?${qs.toString()}`;
}

/**
 * Inclusive ISO date bounds for the selected timeframe, or null when no
 * year is selected. A year without a month spans the whole year.
 */
export function periodRange(
  year: number | null,
  month: number | null,
): { start: string; end: string } | null {
  if (year === null) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (month === null) return { start: `${year}-01-01`, end: `${year}-12-31` };
  // Day 0 of the next month is the last day of this one.
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { start: `${year}-${pad(month)}-01`, end: `${year}-${pad(month)}-${pad(lastDay)}` };
}

/**
 * Escapes LIKE/ILIKE wildcards so a search for "50%" matches a literal
 * percent sign instead of acting as a pattern. Postgres treats backslash as
 * the default LIKE escape character, which is what both the PostgREST
 * `ilike` filter and the transaction_periods() RPC rely on.
 */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}
