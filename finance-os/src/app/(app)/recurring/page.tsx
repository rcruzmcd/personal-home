import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/ui/stat";
import { formatCurrency } from "@/lib/format";
import { calculateMonthlyRecurringTotal, type CalcRecurringExpense } from "@/lib/calculations";
import { deleteRecurringExpense } from "./actions";

const FREQUENCY_LABEL: Record<string, string> = {
  daily: "/day",
  weekly: "/week",
  monthly: "/month",
  annually: "/year",
};

export default async function RecurringExpensesPage() {
  const supabase = await createClient();
  const { data: recurringExpenses } = await supabase
    .from("recurring_expenses")
    .select("id, name, merchant, amount, frequency, next_date, active, accounts(name), categories(name)")
    .order("active", { ascending: false })
    .order("amount", { ascending: false });

  const rows = recurringExpenses ?? [];
  const monthlyTotal: CalcRecurringExpense[] = rows.map((row) => ({
    amount: row.amount,
    frequency: row.frequency,
    active: row.active,
  }));

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      {/* The monthly total was a whole card containing one number; as a
          header stat it says the same thing without a card's worth of
          vertical space above the list it describes. */}
      <PageHeader
        title="Recurring Expenses"
        stats={
          <Stat
            label="Monthly obligations"
            value={formatCurrency(calculateMonthlyRecurringTotal(monthlyTotal))}
          />
        }
        actions={
          <Link href="/recurring/new">
            <Button>Add recurring expense</Button>
          </Link>
        }
      />

      {!rows.length ? (
        <p className="text-body text-muted">No recurring expenses yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((expense) => {
            const accountName = (expense.accounts as unknown as { name: string } | null)?.name;
            const categoryName = (expense.categories as unknown as { name: string } | null)?.name;
            return (
              <Card key={expense.id} className="flex items-center justify-between">
                <div>
                  <p className="text-h4 font-semibold text-foreground">
                    {expense.name}
                    {!expense.active && <span className="text-small text-muted"> (inactive)</span>}
                  </p>
                  <p className="text-small text-muted">
                    {[accountName, categoryName, expense.next_date && `next ${expense.next_date}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-h4 font-semibold text-foreground">
                    {formatCurrency(expense.amount)}
                    <span className="text-small font-normal text-muted">
                      {FREQUENCY_LABEL[expense.frequency]}
                    </span>
                  </p>
                  <Link
                    href={`/recurring/${expense.id}/edit`}
                    className="text-body font-medium text-purple underline"
                  >
                    Edit
                  </Link>
                  <DeleteConfirmDialog
                    onConfirm={deleteRecurringExpense.bind(null, expense.id)}
                    title="Delete this recurring expense?"
                    description={`This permanently deletes "${expense.name}". This cannot be undone.`}
                    trigger={
                      <Button type="button" variant="tertiary">
                        Delete
                      </Button>
                    }
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
