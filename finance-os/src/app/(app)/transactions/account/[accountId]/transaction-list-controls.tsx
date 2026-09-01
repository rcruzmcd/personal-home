"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { inputClasses } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  TRANSACTION_LIST_PAGE_SIZES,
  transactionListHref,
  type TransactionListDirection,
  type TransactionListPageSize,
  type TransactionListSort,
} from "@/lib/transactions/list-params";

export function TransactionListControls({
  accountId,
  pageSize,
  sort,
  dir,
}: {
  accountId: string;
  pageSize: TransactionListPageSize;
  sort: TransactionListSort;
  dir: TransactionListDirection;
}) {
  const router = useRouter();

  function go(next: { pageSize?: TransactionListPageSize; sort?: TransactionListSort; dir?: TransactionListDirection }) {
    router.push(
      transactionListHref(accountId, { page: 1, pageSize, sort, dir, ...next }),
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Transactions per page"
        className={cn(inputClasses, "w-auto shrink-0")}
        value={pageSize}
        onChange={(e) => go({ pageSize: Number(e.target.value) as TransactionListPageSize })}
      >
        {TRANSACTION_LIST_PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </select>
      <select
        aria-label="Sort by"
        className={cn(inputClasses, "w-auto shrink-0")}
        value={sort}
        onChange={(e) => go({ sort: e.target.value as TransactionListSort, dir: "desc" })}
      >
        <option value="date">Date</option>
        <option value="amount">Amount</option>
      </select>
      <Button
        type="button"
        variant="secondary"
        className="shrink-0 whitespace-nowrap"
        onClick={() => go({ dir: dir === "asc" ? "desc" : "asc" })}
      >
        {sort === "date"
          ? dir === "desc"
            ? "Newest first"
            : "Oldest first"
          : dir === "desc"
            ? "Highest first"
            : "Lowest first"}
      </Button>
    </div>
  );
}
