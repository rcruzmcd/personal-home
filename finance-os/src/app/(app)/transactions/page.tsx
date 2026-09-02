import Link from "next/link";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { iconActionClasses } from "@/components/ui/icon-action";
import { DeleteAllTransactionsDialog } from "@/components/delete-all-transactions-dialog";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const [{ data: accounts }, { data: counts }] = await Promise.all([
    supabase
      .from("accounts")
      .select("id, name, institution, type")
      .eq("active", true)
      .order("type")
      .order("name"),
    // One aggregate query covering every account, rather than a count query
    // per card. If the RPC is missing (migration not applied yet) the counts
    // are simply omitted.
    supabase.rpc("transaction_counts_by_account"),
  ]);

  const countByAccount = new Map<string, number>(
    ((counts ?? []) as { account_id: string; transaction_count: number }[]).map((row) => [
      row.account_id,
      row.transaction_count,
    ]),
  );

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        title="Transactions"
        description="Select an account to browse its transactions."
        actions={
          <>
            <Link href="/transactions/import">
              <Button variant="secondary">Import</Button>
            </Link>
            <Link href="/transactions/new">
              <Button>Add transaction</Button>
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-3">
        <h2 className="text-h3 font-semibold text-foreground">Accounts</h2>
        {!accounts?.length ? (
          <p className="text-body text-muted">
            <Link href="/accounts/new" className="text-purple underline">
              Add an account
            </Link>{" "}
            first to view its transactions.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {accounts.map((account) => {
              const count = countByAccount.get(account.id);
              return (
                <Card key={account.id} className="flex items-center justify-between gap-4">
                  <div>
                    <Link
                      href={`/transactions/account/${account.id}`}
                      className="text-h4 font-semibold text-foreground hover:underline"
                    >
                      {account.name}
                    </Link>
                    <p className="text-small text-muted">
                      {account.institution ? `${account.institution} · ` : ""}
                      {account.type.replace(/_/g, " ")}
                      {count === undefined
                        ? ""
                        : ` · ${count} transaction${count === 1 ? "" : "s"}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/transactions/import?accountId=${account.id}`}
                          aria-label={`Import transactions into ${account.name}`}
                          className={iconActionClasses}
                        >
                          <Upload className="size-4" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Import transactions</TooltipContent>
                    </Tooltip>
                    <DeleteAllTransactionsDialog
                      accountId={account.id}
                      accountName={account.name}
                      count={count}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-h3 font-semibold text-foreground">Categorization rules</h2>
        <p className="text-body text-muted">
          Manage the rules that auto-categorize transactions on import.
        </p>
        <div>
          <Link href="/transactions/rules">
            <Button variant="secondary">Manage categorization rules</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
