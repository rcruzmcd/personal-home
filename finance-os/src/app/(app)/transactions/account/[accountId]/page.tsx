import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/ui/stat";
import { formatCurrency } from "@/lib/format";
import { TransactionList } from "./transaction-list";
import { TransactionPageSize, TransactionSortControls } from "./transaction-list-controls";
import { TransactionSearch } from "./transaction-search";
import { PeriodNav } from "./period-nav";
import {
  escapeLikePattern,
  parseTransactionListParams,
  periodRange,
  transactionListHref,
} from "@/lib/transactions/list-params";
import { buildPeriodTree, periodLabel, type PeriodBucket } from "@/lib/transactions/periods";

export default async function AccountTransactionsPage({
  params,
  searchParams,
}: PageProps<"/transactions/account/[accountId]">) {
  const { accountId } = await params;
  const listParams = parseTransactionListParams(await searchParams);
  const { page, pageSize, q, year, month } = listParams;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const range = periodRange(year, month);
  const searchPattern = q ? escapeLikePattern(q) : null;

  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("id, date, description, amount, type, tags, user_notes, categories(name)", {
      count: "exact",
    })
    .eq("account_id", accountId);
  if (searchPattern) query = query.ilike("description", `%${searchPattern}%`);
  if (range) query = query.gte("date", range.start).lte("date", range.end);

  const [{ data: account }, { data: transactions, count }, { data: periodBuckets }, { data: totals }] =
    await Promise.all([
      supabase
        .from("accounts")
        .select("id, name, institution, type, balance")
        .eq("id", accountId)
        .single(),
      query.order(listParams.sort, { ascending: listParams.dir === "asc" }).range(from, to),
      // Periods reflect the search but not the selected timeframe, so the
      // navigation can always move to another month. If the RPC is missing
      // (migration not applied yet) the nav simply doesn't render.
      supabase.rpc("transaction_periods", {
        p_account_id: accountId,
        p_query: searchPattern,
      }),
      // Net across every matching row, not just this page — aggregated in the
      // database so the header stays correct past the first page. Omitted
      // (like the periods above) when the migration hasn't been applied.
      supabase.rpc("transaction_totals", {
        p_account_id: accountId,
        p_query: searchPattern,
        p_start: range?.start ?? null,
        p_end: range?.end ?? null,
      }),
    ]);

  if (!account) notFound();

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rows = transactions ?? [];
  const years = buildPeriodTree((periodBuckets ?? []) as PeriodBucket[]);
  const isFiltered = Boolean(q) || year !== null;
  const net = (totals as { net: number }[] | null)?.[0]?.net ?? null;

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        breadcrumb={[{ label: "Transactions", href: "/transactions" }]}
        title={account.name}
        description={`${account.institution ? `${account.institution} · ` : ""}${account.type.replace(/_/g, " ")}`}
        stats={
          <>
            <Stat label="Current balance" value={formatCurrency(account.balance)} />
            {net !== null && (
              <Stat
                label={`${periodLabel(year, month)} net`}
                value={formatCurrency(net)}
                tone={net > 0 ? "positive" : "neutral"}
              />
            )}
          </>
        }
        actions={
          <>
            <Link href={`/transactions/import?accountId=${account.id}`}>
              <Button variant="secondary">Import</Button>
            </Link>
            <Link href="/transactions/new">
              <Button>Add transaction</Button>
            </Link>
          </>
        }
      />

      {/* Filtering (timeframe + search) is concentrated in one band; sorting
          is pushed to the far side of it, since the two are easy to confuse
          when they sit in the same undifferentiated stack. */}
      <div className="flex flex-col gap-4">
        <PeriodNav accountId={accountId} params={listParams} years={years} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TransactionSearch accountId={accountId} params={listParams} />
          <TransactionSortControls accountId={accountId} params={listParams} />
        </div>
      </div>

      {!rows.length ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-body text-muted">
            {isFiltered
              ? "No transactions match these filters."
              : "No transactions for this account yet."}
          </p>
          {isFiltered && (
            <Link
              href={transactionListHref(accountId, {
                ...listParams,
                page: 1,
                q: "",
                year: null,
                month: null,
              })}
            >
              <Button variant="secondary">Clear filters</Button>
            </Link>
          )}
        </div>
      ) : (
        <TransactionList accountId={accountId} transactions={rows} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-small text-muted">
          {totalCount} transaction{totalCount === 1 ? "" : "s"} · page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-3">
          <TransactionPageSize accountId={accountId} params={listParams} />
          {page > 1 ? (
            <Link href={transactionListHref(accountId, { ...listParams, page: page - 1 })}>
              <Button variant="secondary">Previous</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              Previous
            </Button>
          )}
          {page < totalPages ? (
            <Link href={transactionListHref(accountId, { ...listParams, page: page + 1 })}>
              <Button variant="secondary">Next</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              Next
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
