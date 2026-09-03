import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { MonthNav } from "@/components/month-nav";
import { Stat } from "@/components/ui/stat";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import {
  currentMonth,
  monthDate,
  monthHref,
  monthRange,
  parseMonthParams,
} from "@/lib/month-params";
import { buildBudgetSummary, type CalcBudget, type CategorySpend } from "@/lib/calculations";
import { saveBudgets } from "./actions";
import { BudgetGrid } from "./budget-grid";

export default async function BudgetsPage({ searchParams }: PageProps<"/budgets">) {
  const today = new Date();
  const params = parseMonthParams(await searchParams, today);
  const { start, end } = monthRange(params);

  const supabase = await createClient();
  const [{ data: categoryRows }, { data: budgetRows }, { data: spendRows }] = await Promise.all([
    // Only expense categories are budgetable — a transfer category is money
    // moving between the user's own accounts, which is never spending (§3).
    supabase.from("categories").select("id, name").eq("type", "expense").order("position"),
    supabase.from("budgets").select("category_id, amount, categories(name)"),
    // Aggregated in the database rather than by summing fetched rows — see
    // supabase/migrations/20260904000000_create_budgets.sql.
    supabase.rpc("budget_spend_by_category", { p_start: start, p_end: end }),
  ]);

  const categories = categoryRows ?? [];
  const budgets: CalcBudget[] = (budgetRows ?? []).map((row) => ({
    categoryId: row.category_id,
    // The untyped Supabase client (no generated Database types in this project
    // yet) still types every embed as an array, hence the cast.
    categoryName: (row.categories as unknown as { name: string } | null)?.name ?? null,
    amount: row.amount,
  }));
  // The RPC returns snake_case columns and numeric as a string; both are
  // normalized here so the calc layer only ever sees its own CategorySpend shape.
  const spendByCategory: CategorySpend[] = (
    (spendRows ?? []) as { category_id: string | null; spent: number | string }[]
  ).map((row) => ({ categoryId: row.category_id, spent: Number(row.spent) }));

  const summary = buildBudgetSummary({
    budgets,
    categories,
    spendByCategory,
    month: monthDate(params),
    asOfDate: today,
  });

  const now = currentMonth(today);
  const isCurrentMonth = params.year === now.year && params.month === now.month;
  const hasAnyBudget = summary.budgetedCount > 0;

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        title="Budgets"
        description="A standing monthly limit per category. Limits apply to every month and don't roll over."
        stats={
          hasAnyBudget ? (
            <>
              <Stat label="Budgeted" value={formatCurrency(summary.totalBudgeted)} />
              <Stat label="Spent" value={formatCurrency(summary.totalSpent)} />
              <Stat
                label="Remaining"
                value={formatCurrency(summary.totalRemaining)}
                // Red only when the plan as a whole is blown, and the label
                // beside it still reads "Remaining -$120" in words.
                tone={summary.totalRemaining < 0 ? "danger" : "positive"}
              />
            </>
          ) : undefined
        }
      />

      <MonthNav params={params} today={today} href={(next) => monthHref("/budgets", next, today)} />

      {!hasAnyBudget && (
        <Card variant="featured" className="flex flex-col gap-2">
          <p className="text-body font-medium text-foreground">No budgets set yet</p>
          <p className="text-small text-muted">
            Give a category a monthly limit below and this page will track it every month. If
            you&apos;re not sure where to start,{" "}
            <Link href="/transactions" className="text-purple underline underline-offset-2">
              review your transactions
            </Link>{" "}
            to see what you actually spend.
          </p>
        </Card>
      )}

      {/* Limits are standing, so editing them from inside a past month would
          imply they were per-month. Past months are read-only. */}
      {!isCurrentMonth && (
        <p className="text-small text-muted">
          Showing a past month. Limits are the same every month — switch to this month to change
          them.
        </p>
      )}

      <BudgetGrid action={saveBudgets} lines={[...summary.lines]} editable={isCurrentMonth} />

      {summary.unbudgetedSpend > 0 && (
        <p className="text-small text-muted">
          {formatCurrency(summary.unbudgetedSpend)} spent this month in categories with no limit,
          including anything uncategorized.
        </p>
      )}
    </main>
  );
}
