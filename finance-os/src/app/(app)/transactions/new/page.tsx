import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
import { TransactionForm } from "../transaction-form";
import { createTransaction } from "../actions";

export default async function NewTransactionPage() {
  const supabase = await createClient();
  const [{ data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("accounts").select("id, name").eq("active", true).order("name"),
    supabase.from("categories").select("id, name").order("position"),
  ]);

  return (
    <FormPage
      title="Add transaction"
      breadcrumb={[{ label: "Transactions", href: "/transactions" }]}
    >
      <TransactionForm
        action={createTransaction}
        accounts={accounts ?? []}
        categories={categories ?? []}
        submitLabel="Add transaction"
      />
    </FormPage>
  );
}
