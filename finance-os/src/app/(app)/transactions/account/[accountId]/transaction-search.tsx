"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { inputClasses } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  transactionListHref,
  type TransactionListParams,
} from "@/lib/transactions/list-params";

/**
 * Description search for the account transaction list. The query lives in
 * the URL (so it survives reloads, pagination and sharing), but typing
 * shouldn't push a history entry per keystroke — input is debounced and
 * navigates with `replace`.
 */
export function TransactionSearch({
  accountId,
  params,
}: {
  accountId: string;
  params: TransactionListParams;
}) {
  const router = useRouter();
  const [value, setValue] = useState(params.q);
  // Tracks the query the URL already reflects, so an external navigation
  // (a period pill, Back) resyncs the box without the debounce below
  // immediately navigating back to the stale value.
  const committed = useRef(params.q);

  useEffect(() => {
    if (params.q !== committed.current) {
      committed.current = params.q;
      setValue(params.q);
    }
  }, [params.q]);

  useEffect(() => {
    const next = value.trim();
    if (next === committed.current) return;
    const timer = setTimeout(() => {
      committed.current = next;
      // A new search invalidates the current offset — always land on page 1.
      router.replace(transactionListHref(accountId, { ...params, page: 1, q: next }));
    }, 300);
    return () => clearTimeout(timer);
  }, [value, accountId, params, router]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search descriptions"
        aria-label="Search transaction descriptions"
        className={cn(inputClasses, "pl-9 pr-9")}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-purple transition-colors duration-200"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
