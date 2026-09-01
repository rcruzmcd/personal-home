import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TransactionForm } from "../../transaction-form";
import { updateTransaction } from "../../actions";

export default async function EditTransactionPage({
  params,
}: PageProps<"/transactions/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: transaction }, { data: accounts }, { data: categories }] = await Promise.all([
    supabase
      .from("transactions")
      .select("type, account_id, date, description, merchant, amount, category_id, subcategory")
      .eq("id", id)
      .single(),
    supabase.from("accounts").select("id, name").eq("active", true).order("name"),
    supabase.from("categories").select("id, name").order("position"),
  ]);

  if (!transaction || transaction.type === "transfer") notFound();

  return (
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm
            action={updateTransaction.bind(null, id)}
            accounts={accounts ?? []}
            categories={categories ?? []}
            defaultValues={{ ...transaction, amount: Math.abs(transaction.amount) }}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </main>
  );
}
