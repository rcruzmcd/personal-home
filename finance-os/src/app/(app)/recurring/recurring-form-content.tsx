import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecurringExpenseForm } from "./recurring-expense-form";
import { createRecurringExpense, updateRecurringExpense } from "./actions";
import { RECURRING_FREQUENCIES } from "@/lib/validations/recurring-expense";

// Shared by the full page and the intercepted sheet.

type SearchParams = Record<string, string | string[] | undefined> | undefined;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

async function formOptions() {
  const supabase = await createClient();
  const [{ data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("accounts").select("id, name").eq("active", true).order("name"),
    supabase.from("categories").select("id, name").order("position"),
  ]);
  return { accounts: accounts ?? [], categories: categories ?? [] };
}

/**
 * Supports prefill query params (name, merchant, amount, frequency,
 * transactionIds) so the inbox's "possible recurring expense" suggestions (§11)
 * can hand off a detected pattern — including its inferred cadence and the
 * transactions to retroactively link — without the user retyping it.
 */
export async function NewRecurringContent({ params }: { params: SearchParams }) {
  const { accounts, categories } = await formOptions();

  const frequencyParam = first(params?.frequency);
  const frequency = (RECURRING_FREQUENCIES as readonly string[]).includes(frequencyParam ?? "")
    ? (frequencyParam as (typeof RECURRING_FREQUENCIES)[number])
    : "monthly";

  return (
    <RecurringExpenseForm
      action={createRecurringExpense}
      accounts={accounts}
      categories={categories}
      defaultValues={{
        name: first(params?.name) ?? "",
        merchant: first(params?.merchant) ?? null,
        amount: Number(first(params?.amount) ?? 0) || 0,
        frequency,
        next_date: null,
        category_id: null,
        account_id: null,
        active: true,
      }}
      submitLabel="Add recurring expense"
      transactionIds={first(params?.transactionIds)}
    />
  );
}

export async function EditRecurringContent({ id }: { id: string }) {
  const supabase = await createClient();
  const [{ data: recurringExpense }, options] = await Promise.all([
    supabase
      .from("recurring_expenses")
      .select("name, merchant, amount, frequency, next_date, category_id, account_id, active")
      .eq("id", id)
      .single(),
    formOptions(),
  ]);

  if (!recurringExpense) notFound();

  return (
    <RecurringExpenseForm
      action={updateRecurringExpense.bind(null, id)}
      accounts={options.accounts}
      categories={options.categories}
      defaultValues={recurringExpense}
      submitLabel="Save changes"
    />
  );
}
