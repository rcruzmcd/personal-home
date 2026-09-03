import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentMonth, monthRange } from "@/lib/month-params";
import { TransactionForm } from "./transaction-form";
import { createTransaction, updateTransaction } from "./actions";

// Shared by the full page and the intercepted sheet.

/**
 * `exclude` is the transaction being edited. Its amount is already inside this
 * month's spend, so leaving it in would make the remaining-budget hint read low
 * by exactly the figure on screen. Only applies when its date is in this month.
 */
async function formOptions(exclude?: { categoryId: string | null; amount: number; date: string }) {
  const supabase = await createClient();
  const { start, end } = monthRange(currentMonth(new Date()));

  const [{ data: accounts }, { data: categories }, { data: budgetRows }, { data: spendRows }] =
    await Promise.all([
      supabase.from("accounts").select("id, name").eq("active", true).order("name"),
      supabase.from("categories").select("id, name").order("position"),
      supabase.from("budgets").select("category_id, amount"),
      supabase.rpc("budget_spend_by_category", { p_start: start, p_end: end }),
    ]);

  const spentByCategory = new Map<string, number>();
  for (const row of ((spendRows ?? []) as { category_id: string | null; spent: number | string }[])) {
    if (row.category_id) spentByCategory.set(row.category_id, Number(row.spent));
  }
  if (exclude?.categoryId && exclude.date >= start && exclude.date <= end) {
    const current = spentByCategory.get(exclude.categoryId);
    if (current !== undefined) {
      spentByCategory.set(exclude.categoryId, current - Math.abs(exclude.amount));
    }
  }

  // The remaining figure is resolved here, on the server, so the form needs no
  // fetch of its own and no effect — it just reads the option it already has.
  const budgetByCategory = new Map(
    (budgetRows ?? []).map((row) => [
      row.category_id as string,
      { limit: row.amount as number, spent: spentByCategory.get(row.category_id) ?? 0 },
    ]),
  );

  return {
    accounts: accounts ?? [],
    categories: (categories ?? []).map((category) => {
      const budget = budgetByCategory.get(category.id);
      return budget
        ? {
            ...category,
            budget: { ...budget, remaining: budget.limit - budget.spent },
          }
        : category;
    }),
  };
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
  // Sequential rather than parallel: formOptions needs this row's category and
  // amount to net it out of the month's spend.
  const { data: transaction } = await supabase
    .from("transactions")
    .select(
      "type, account_id, date, description, merchant, amount, category_id, subcategory, tags, user_notes",
    )
    .eq("id", id)
    .single();

  const options = await formOptions(
    transaction
      ? {
          categoryId: transaction.category_id,
          amount: transaction.amount,
          date: transaction.date,
        }
      : undefined,
  );

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
