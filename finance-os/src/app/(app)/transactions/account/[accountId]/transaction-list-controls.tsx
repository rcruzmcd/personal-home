"use client";

import { useRouter } from "next/navigation";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inputClasses } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  TRANSACTION_LIST_PAGE_SIZES,
  transactionListHref,
  type TransactionListDirection,
  type TransactionListPageSize,
  type TransactionListParams,
  type TransactionListSort,
} from "@/lib/transactions/list-params";

type ControlProps = { accountId: string; params: TransactionListParams };

type NextParams = {
  pageSize?: TransactionListPageSize;
  sort?: TransactionListSort;
  dir?: TransactionListDirection;
};

// Every control resets to page 1 (the current offset means nothing once the
// ordering or page size changes) but keeps the active search/timeframe.
function useListNavigation(accountId: string, params: TransactionListParams) {
  const router = useRouter();
  return (next: NextParams) =>
    router.push(transactionListHref(accountId, { ...params, page: 1, ...next }));
}

function directionLabel(sort: TransactionListSort, dir: TransactionListDirection) {
  if (sort === "date") return dir === "desc" ? "Newest first" : "Oldest first";
  return dir === "desc" ? "Highest first" : "Lowest first";
}

/**
 * Ordering for the account transaction list. Kept separate from the filter
 * controls (search + timeframe) and right-aligned beside them: sorting
 * changes the order of the same set, filtering changes the set, and users
 * conflate the two when they sit in one undifferentiated stack.
 */
export function TransactionSortControls({ accountId, params }: ControlProps) {
  const go = useListNavigation(accountId, params);
  const { sort, dir } = params;
  const DirectionIcon = dir === "desc" ? ArrowDownWideNarrow : ArrowUpNarrowWide;

  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Sort by"
        className={cn(inputClasses, "w-auto shrink-0")}
        value={sort}
        // A new sort field starts from its most useful end (newest / largest).
        onChange={(e) => go({ sort: e.target.value as TransactionListSort, dir: "desc" })}
      >
        <option value="date">Date</option>
        <option value="amount">Amount</option>
      </select>
      <Button
        type="button"
        variant="secondary"
        className="shrink-0 whitespace-nowrap gap-2"
        aria-label={`Sort direction: ${directionLabel(sort, dir)}`}
        onClick={() => go({ dir: dir === "asc" ? "desc" : "asc" })}
      >
        <DirectionIcon aria-hidden className="size-4" />
        {directionLabel(sort, dir)}
      </Button>
    </div>
  );
}

/**
 * Page size lives with the pager at the foot of the list rather than above
 * it — it's a pagination control, and splitting the two put related controls
 * at opposite ends of the page.
 */
export function TransactionPageSize({ accountId, params }: ControlProps) {
  const go = useListNavigation(accountId, params);

  return (
    <select
      aria-label="Transactions per page"
      className={cn(inputClasses, "w-auto shrink-0")}
      value={params.pageSize}
      onChange={(e) => go({ pageSize: Number(e.target.value) as TransactionListPageSize })}
    >
      {TRANSACTION_LIST_PAGE_SIZES.map((size) => (
        <option key={size} value={size}>
          {size} / page
        </option>
      ))}
    </select>
  );
}
