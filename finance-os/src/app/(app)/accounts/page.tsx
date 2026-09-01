import Link from "next/link";
import { Receipt, Upload, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { formatCurrency } from "@/lib/format";
import { isEntryUpToDate } from "@/lib/calculations/statement-entry";
import { deleteAccount } from "./actions";

const actionIconClasses =
  "inline-flex items-center justify-center size-9 rounded-md text-muted hover:text-purple hover:bg-border transition-colors duration-200";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select(
      "id, name, institution, type, balance, active, statement_date, transactions_entered_through",
    )
    .order("type")
    .order("name");

  const today = new Date();

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-bold text-purple">Accounts</h1>
        <Link href="/accounts/new">
          <Button>Add account</Button>
        </Link>
      </div>

      {!accounts?.length ? (
        <p className="text-body text-muted">No accounts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const upToDate = isEntryUpToDate(
              account.transactions_entered_through,
              account.statement_date,
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
