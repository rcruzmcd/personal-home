import Link from "next/link";
import { Receipt, Upload, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { DeleteAllTransactionsDialog } from "@/components/delete-all-transactions-dialog";
import { iconActionClasses as actionIconClasses } from "@/components/ui/icon-action";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/ui/stat";
import { formatCurrency } from "@/lib/format";
import { calculateNetWorth, type CalcAccount } from "@/lib/calculations";
import { isEntryUpToDate } from "@/lib/calculations/statement-entry";
import { deleteAccount } from "./actions";

export default async function AccountsPage() {
  const supabase = await createClient();
  const [{ data: accounts }, { data: counts }] = await Promise.all([
    supabase
      .from("accounts")
      .select(
        "id, name, institution, type, balance, active, statement_day, transactions_entered_through",
      )
      .order("type")
      .order("name"),
    // One aggregate query covering every account; omitted if the RPC is
    // missing (migration not applied yet).
    supabase.rpc("transaction_counts_by_account"),
  ]);

  const countByAccount = new Map<string, number>(
    ((counts ?? []) as { account_id: string; transaction_count: number }[]).map((row) => [
      row.account_id,
      row.transaction_count,
    ]),
  );

  const today = new Date();
  // The header answers "how are these accounts doing?" with the same figure
  // the dashboard leads on, rather than leaving the band empty.
  const activeAccounts = (accounts ?? []).filter((account) => account.active);
  const { netWorth } = calculateNetWorth((accounts ?? []) as CalcAccount[]);

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        title="Accounts"
        description={`${activeAccounts.length} active account${activeAccounts.length === 1 ? "" : "s"}`}
        stats={
          <Stat
            label="Net worth"
            value={formatCurrency(netWorth)}
            tone={netWorth >= 0 ? "positive" : "neutral"}
          />
        }
        actions={
          <Link href="/accounts/new">
            <Button>Add account</Button>
          </Link>
        }
      />

      {!accounts?.length ? (
        <p className="text-body text-muted">No accounts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const upToDate = isEntryUpToDate(
              account.transactions_entered_through,
              account.statement_day,
              today,
            );
            return (
            <Card key={account.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>
                  <Link href={`/accounts/${account.id}`} className="hover:underline">
                    {account.name}
                  </Link>
                  {!account.active && (
                    <span className="text-small font-normal text-muted"> (inactive)</span>
                  )}
                </CardTitle>
                <CardDescription>
                  {account.institution ? `${account.institution} · ` : ""}
                  {account.type.replace(/_/g, " ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-2">
                <p className="text-h2 font-bold text-foreground">
                  {formatCurrency(account.balance)}
                </p>
                {account.active && (
                  <span className={`text-small ${upToDate ? "text-green" : "text-purple"}`}>
                    {upToDate ? "Up to date" : "Needs entry"}
                  </span>
                )}
              </CardContent>
              <CardFooter className="justify-end gap-1 border-t border-border pt-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/transactions/account/${account.id}`}
                      aria-label="View transactions"
                      className={actionIconClasses}
                    >
                      <Receipt className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>View transactions</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/transactions/import?accountId=${account.id}`}
                      aria-label="Import transactions"
                      className={actionIconClasses}
                    >
                      <Upload className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Import transactions</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/accounts/${account.id}/edit`}
                      aria-label="Edit account"
                      className={actionIconClasses}
                    >
                      <Pencil className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <DeleteAllTransactionsDialog
                  accountId={account.id}
                  accountName={account.name}
                  count={countByAccount.get(account.id)}
                />
                <DeleteConfirmDialog
                  onConfirm={deleteAccount.bind(null, account.id)}
                  tooltipLabel="Delete"
                  title="Delete this account?"
                  description={`This permanently deletes "${account.name}" and all of its transactions and reconciliation history. This cannot be undone.`}
                  trigger={
                    <button type="button" aria-label="Delete account" className={actionIconClasses}>
                      <Trash2 className="size-4" />
                    </button>
                  }
                />
              </CardFooter>
            </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
