import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TransactionForm } from "../transaction-form";
import { createTransaction } from "../actions";

export default async function NewTransactionPage() {
  const supabase = await createClient();
  const [{ data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("accounts").select("id, name").eq("active", true).order("name"),
    supabase.from("categories").select("id, name").order("position"),
  ]);

  return (
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm
            action={createTransaction}
            accounts={accounts ?? []}
            categories={categories ?? []}
            submitLabel="Add transaction"
          />
        </CardContent>
      </Card>
    </main>
  );
}
