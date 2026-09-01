import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit recurring expense</CardTitle>
        </CardHeader>
        <CardContent>
          <RecurringExpenseForm
            action={updateRecurringExpense.bind(null, id)}
            accounts={accounts ?? []}
            categories={categories ?? []}
            defaultValues={recurringExpense}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </main>
  );
}
