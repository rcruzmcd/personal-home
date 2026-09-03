import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TransactionForm } from "./transaction-form";
import { createTransaction, updateTransaction } from "./actions";

// Shared by the full page and the intercepted sheet.

async function formOptions() {
  const supabase = await createClient();
  const [{ data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("accounts").select("id, name").eq("active", true).order("name"),
    supabase.from("categories").select("id, name").order("position"),
  ]);
  return { accounts: accounts ?? [], categories: categories ?? [] };
}

export async function NewTransactionContent() {
  const { accounts, categories } = await formOptions();
  return (
    <TransactionForm
      action={createTransaction}
      accounts={accounts}
      categories={categories}
      submitLabel="Add transaction"
    />
  );
}

export async function EditTransactionContent({ id }: { id: string }) {
  const supabase = await createClient();
  const [{ data: transaction }, options] = await Promise.all([
    supabase
      .from("transactions")
      .select(
        "type, account_id, date, description, merchant, amount, category_id, subcategory, tags, user_notes",
      )
      .eq("id", id)
      .single(),
    formOptions(),
  ]);

  // Transfers are two linked ledger rows (see create_transfer); editing one leg
  // in place isn't supported.
  if (!transaction || transaction.type === "transfer") notFound();

  return (
    <TransactionForm
      action={updateTransaction.bind(null, id)}
      accounts={options.accounts}
      categories={options.categories}
      defaultValues={{ ...transaction, amount: Math.abs(transaction.amount) }}
      submitLabel="Save changes"
      transactionId={id}
    />
  );
}
