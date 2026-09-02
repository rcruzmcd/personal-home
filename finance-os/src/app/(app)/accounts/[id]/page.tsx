import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/ui/stat";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { parseDateOnly } from "@/lib/date";
import { isEntryUpToDate } from "@/lib/calculations/statement-entry";
import { reconcileAccount, markTransactionsEntered } from "../actions";
import { ReconcileForm } from "./reconcile-form";
import { EntryStatusForm } from "./entry-status-form";

export default async function AccountDetailPage({ params }: PageProps<"/accounts/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: account }, { data: transactions }, { data: reconciliations }] =
    await Promise.all([
      supabase
        .from("accounts")
        .select(
          "id, name, institution, type, balance, active, opening_date, last_updated, notes, due_date, statement_date, transactions_entered_through",
        )
        .eq("id", id)
        .single(),
      supabase
        .from("transactions")
        .select("id, date, description, amount, type")
        .eq("account_id", id)
        .order("date", { ascending: false })
        .limit(10),
      supabase
        .from("reconciliations")
        .select("id, expected_balance, bank_balance, difference, explanation, notes, created_at")
        .eq("account_id", id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  if (!account) notFound();

  const lastReconciliation = reconciliations?.[0] ?? null;
  const upToDate = isEntryUpToDate(
    account.transactions_entered_through,
    account.statement_date,
    new Date(),
  );

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        breadcrumb={[{ label: "Accounts", href: "/accounts" }]}
        title={account.name}
        description={`${[account.institution, account.type.replace(/_/g, " ")]
          .filter(Boolean)
          .join(" · ")}${!account.active ? " · inactive" : ""}`}
        stats={
          <>
            <Stat label="Balance" value={formatCurrency(account.balance)} />
            <Stat
              label="Entry status"
              value={upToDate ? "Up to date" : "Needs entry"}
              tone={upToDate ? "positive" : "accent"}
            />
          </>
        }
        actions={
          <>
            <Link href={`/transactions/account/${account.id}`}>
              <Button variant="secondary">Transactions</Button>
            </Link>
            <Link href={`/accounts/${account.id}/edit`}>
              <Button>Edit</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account info</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-body text-muted">Opened</p>
              <p className="text-body text-foreground">
                {account.opening_date ?? "—"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-body text-muted">Last updated</p>
              <p className="text-body text-foreground">
                {formatShortDate(new Date(account.last_updated))}
              </p>
            </div>
            {account.statement_date && (
              <div className="flex items-center justify-between">
                <p className="text-body text-muted">Statement date</p>
                <p className="text-body text-foreground">
                  {formatShortDate(parseDateOnly(account.statement_date))}
                </p>
              </div>
            )}
            {account.due_date && (
              <div className="flex items-center justify-between">
                <p className="text-body text-muted">Due date</p>
                <p className="text-body text-foreground">
                  {formatShortDate(parseDateOnly(account.due_date))}
                </p>
              </div>
            )}
            {account.notes && <p className="text-small text-muted mt-2">{account.notes}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reconciliation status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {!lastReconciliation ? (
              <p className="text-body text-muted">Never reconciled.</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-body text-muted">Last reconciled</p>
                  <p className="text-body text-foreground">
                    {formatShortDate(new Date(lastReconciliation.created_at))}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-body text-muted">Expected balance</p>
                  <p className="text-body text-foreground">
                    {formatCurrency(lastReconciliation.expected_balance)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-body text-muted">Bank balance</p>
                  <p className="text-body text-foreground">
                    {formatCurrency(lastReconciliation.bank_balance)}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2 mt-1">
                  <p className="text-body font-semibold text-foreground">Difference</p>
                  <p
                    className={`text-body font-semibold ${
                      lastReconciliation.difference === 0 ? "text-green" : "text-foreground"
                    }`}
                  >
                    {formatCurrency(lastReconciliation.difference)}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction entry status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-body text-muted">Entered through</p>
            <p className="text-body text-foreground">
              {account.transactions_entered_through
                ? formatShortDate(parseDateOnly(account.transactions_entered_through))
                : "Never"}
            </p>
          </div>
          <EntryStatusForm action={markTransactionsEntered.bind(null, account.id)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reconcile balance</CardTitle>
        </CardHeader>
        <CardContent>
          <ReconcileForm
            action={reconcileAccount.bind(null, account.id)}
            expectedBalance={account.balance}
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-h4 font-semibold text-foreground mb-3">Recent transactions</h2>
        {!transactions?.length ? (
          <p className="text-body text-muted">No transactions yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border bg-surface rounded-xl">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-body font-medium text-foreground">{txn.description}</p>
                  <p className="text-small text-muted">
                    {txn.date} · {txn.type}
                  </p>
                </div>
                <p
                  className={`text-body font-semibold ${
                    txn.amount < 0 ? "text-foreground" : "text-green"
                  }`}
                >
                  {formatCurrency(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
