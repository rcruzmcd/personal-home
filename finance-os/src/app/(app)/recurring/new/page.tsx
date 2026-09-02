import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
import { RecurringExpenseForm } from "../recurring-expense-form";
import { createRecurringExpense } from "../actions";
import { RECURRING_FREQUENCIES } from "@/lib/validations/recurring-expense";

// Supports prefill query params (name, merchant, amount, frequency,
// transactionIds) so the inbox's "possible recurring expense" suggestions
// (§11) can hand off a detected pattern — including its inferred cadence
// and the transactions to retroactively link — without the user retyping it.
export default async function NewRecurringExpensePage({
  searchParams,
}: PageProps<"/recurring/new">) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: accounts }, { data: categories }] = await Promise.all([
    supabase.from("accounts").select("id, name").eq("active", true).order("name"),
    supabase.from("categories").select("id, name").order("position"),
  ]);

  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const frequencyParam = first(params?.frequency);
  const frequency = (RECURRING_FREQUENCIES as readonly string[]).includes(frequencyParam ?? "")
    ? (frequencyParam as (typeof RECURRING_FREQUENCIES)[number])
    : "monthly";

  return (
    <FormPage
      title="Add recurring expense"
      breadcrumb={[{ label: "Recurring Expenses", href: "/recurring" }]}
    >
      <RecurringExpenseForm
        action={createRecurringExpense}
        accounts={accounts ?? []}
        categories={categories ?? []}
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
    </FormPage>
  );
}
