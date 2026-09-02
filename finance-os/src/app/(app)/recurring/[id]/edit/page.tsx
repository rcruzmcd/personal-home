import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
import { RecurringExpenseForm } from "../../recurring-expense-form";
import { updateRecurringExpense } from "../../actions";

export default async function EditRecurringExpensePage({
  params,
}: PageProps<"/recurring/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: recurringExpense }, { data: accounts }, { data: categories }] =
    await Promise.all([
      supabase
        .from("recurring_expenses")
        .select("name, merchant, amount, frequency, next_date, category_id, account_id, active")
        .eq("id", id)
        .single(),
      supabase.from("accounts").select("id, name").eq("active", true).order("name"),
      supabase.from("categories").select("id, name").order("position"),
    ]);

  if (!recurringExpense) notFound();

  return (
    <FormPage
      title="Edit recurring expense"
      breadcrumb={[{ label: "Recurring Expenses", href: "/recurring" }]}
    >
      <RecurringExpenseForm
        action={updateRecurringExpense.bind(null, id)}
        accounts={accounts ?? []}
        categories={categories ?? []}
        defaultValues={recurringExpense}
        submitLabel="Save changes"
      />
    </FormPage>
  );
}
