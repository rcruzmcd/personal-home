import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { deleteAccount } from "./actions";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name, institution, type, balance, active")
    .order("type")
    .order("name");

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
        <div className="flex flex-col gap-3">
          {accounts.map((account) => (
            <Card key={account.id} className="flex items-center justify-between">
              <div>
                <Link href={`/accounts/${account.id}`} className="hover:underline">
                  <p className="text-h4 font-semibold text-foreground">
                    {account.name}
                    {!account.active && (
                      <span className="text-small text-muted"> (inactive)</span>
                    )}
                  </p>
                </Link>
                <p className="text-small text-muted">
                  {account.institution ? `${account.institution} · ` : ""}
                  {account.type.replace(/_/g, " ")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-h4 font-semibold text-foreground">
                  {formatCurrency(account.balance)}
                </p>
                <Link
                  href={`/accounts/${account.id}/edit`}
                  className="text-body font-medium text-purple underline"
                >
                  Edit
                </Link>
                <form action={deleteAccount.bind(null, account.id)}>
                  <Button type="submit" variant="tertiary">
                    Delete
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
