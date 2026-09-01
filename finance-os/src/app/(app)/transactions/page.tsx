import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      "id, date, description, merchant, amount, type, tags, user_notes, accounts(name), categories(name)",
    )
    .order("date", { ascending: false })
    .limit(100);

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-bold text-purple">Transactions</h1>
        <div className="flex items-center gap-3">
          <Link href="/transactions/import">
            <Button variant="secondary">Import</Button>
          </Link>
          <Link href="/transactions/new">
            <Button>Add transaction</Button>
          </Link>
        </div>
      </div>

      {!transactions?.length ? (
        <p className="text-body text-muted">No transactions yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border bg-surface rounded-xl">
          {transactions.map((txn) => {
            const categoryName = (txn.categories as unknown as { name: string } | null)?.name;
            return (
              <div key={txn.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-body font-medium text-foreground">{txn.description}</p>
                  <p className="text-small text-muted">
                    {txn.date} ·{" "}
                    {(txn.accounts as unknown as { name: string } | null)?.name} · {txn.type}
                    {categoryName ? ` · ${categoryName}` : ""}
                  </p>
                  {(txn.tags?.length || txn.user_notes) && (
                    <div className="flex items-center gap-2 mt-1">
                      {txn.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-small text-purple bg-purple/10 rounded-full px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                      {txn.user_notes && (
                        <p className="text-small text-muted italic truncate max-w-xs">
                          {txn.user_notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`text-h4 font-semibold ${
                      txn.amount < 0 ? "text-foreground" : "text-green"
                    }`}
                  >
                    {formatCurrency(txn.amount)}
                  </p>
                  {txn.type !== "transfer" && (
                    <Link
                      href={`/transactions/${txn.id}/edit`}
                      className="text-body font-medium text-purple underline"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
