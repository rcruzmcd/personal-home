import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name, institution, type")
    .eq("active", true)
    .order("type")
    .order("name");

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

      <div className="flex flex-col gap-3">
        <h2 className="text-h3 font-semibold text-foreground">View transactions</h2>
        <p className="text-body text-muted">Select an account to view its transactions.</p>
        {!accounts?.length ? (
          <p className="text-body text-muted">
            <Link href="/accounts/new" className="text-purple underline">
              Add an account
            </Link>{" "}
            first to view its transactions.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {accounts.map((account) => (
              <Link key={account.id} href={`/transactions/account/${account.id}`}>
                <Card className="flex items-center justify-between">
                  <div>
                    <p className="text-h4 font-semibold text-foreground">{account.name}</p>
                    <p className="text-small text-muted">
                      {account.institution ? `${account.institution} · ` : ""}
                      {account.type.replace(/_/g, " ")}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
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
