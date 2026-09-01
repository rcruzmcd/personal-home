import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { TransactionRow } from "../../transaction-row";
import { TransactionListControls } from "./transaction-list-controls";
import { parseTransactionListParams, transactionListHref } from "@/lib/transactions/list-params";

export default async function AccountTransactionsPage({
  params,
  searchParams,
}: PageProps<"/transactions/account/[accountId]">) {
  const { accountId } = await params;
  const { page, pageSize, sort, dir } = parseTransactionListParams(await searchParams);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();
  const [{ data: account }, { data: transactions, count }] = await Promise.all([
    supabase.from("accounts").select("id, name").eq("id", accountId).single(),
    supabase
      .from("transactions")
      .select(
        "id, date, description, amount, type, tags, user_notes, categories(name)",
        { count: "exact" },
      )
      .eq("account_id", accountId)
      .order(sort, { ascending: dir === "asc" })
      .range(from, to),
  ]);

  if (!account) notFound();

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rows = transactions ?? [];

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <div>
        <h1 className="text-h1 font-bold text-purple">{account.name}</h1>
        <Link href="/transactions" className="text-body font-medium text-purple underline">
          Back to Transactions
        </Link>
      </div>

      <TransactionListControls accountId={accountId} pageSize={pageSize} sort={sort} dir={dir} />

      {!rows.length ? (
        <p className="text-body text-muted">No transactions for this account yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border bg-surface rounded-xl">
          {rows.map((txn) => (
            <TransactionRow key={txn.id} transaction={txn} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-small text-muted">
          Page {page} of {totalPages} ({totalCount} transaction{totalCount === 1 ? "" : "s"})
        </p>
        <div className="flex gap-3">
          {page > 1 ? (
            <Link href={transactionListHref(accountId, { page: page - 1, pageSize, sort, dir })}>
              <Button variant="secondary">Previous</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              Previous
            </Button>
          )}
          {page < totalPages ? (
            <Link href={transactionListHref(accountId, { page: page + 1, pageSize, sort, dir })}>
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
