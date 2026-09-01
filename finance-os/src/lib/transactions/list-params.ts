// Pagination/sort state for the account-scoped transaction list
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
};

const DEFAULTS: TransactionListParams = { page: 1, pageSize: 10, sort: "date", dir: "desc" };

// Next 16's searchParams values come back as string | string[] | undefined
// (same normalizer shape as recurring/new/page.tsx).
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
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

  return { page, pageSize, sort, dir };
}

// Single source of truth for /transactions/account/[id] URLs, used by both
// the server-rendered Prev/Next links and the client controls so the query
// shape can never drift between the two.
export function transactionListHref(accountId: string, params: TransactionListParams): string {
  const qs = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sort: params.sort,
    dir: params.dir,
  });
  return `/transactions/account/${accountId}?${qs.toString()}`;
}
