import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
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
      .select(
        "type, account_id, date, description, merchant, amount, category_id, subcategory, tags, user_notes",
      )
      .eq("id", id)
      .single(),
    supabase.from("accounts").select("id, name").eq("active", true).order("name"),
    supabase.from("categories").select("id, name").order("position"),
  ]);

  if (!transaction || transaction.type === "transfer") notFound();

  return (
    <FormPage
      title="Edit transaction"
      breadcrumb={[{ label: "Transactions", href: "/transactions" }]}
    >
      <TransactionForm
        action={updateTransaction.bind(null, id)}
        accounts={accounts ?? []}
        categories={categories ?? []}
        defaultValues={{ ...transaction, amount: Math.abs(transaction.amount) }}
        submitLabel="Save changes"
        transactionId={id}
      />
    </FormPage>
  );
}
