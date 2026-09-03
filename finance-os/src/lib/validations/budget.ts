import { z } from "zod";

/**
 * A single category's monthly limit. The budgets grid submits every expense
 * category in one form (src/app/(app)/budgets/budget-grid.tsx) under field
 * names of the form `amount:<categoryId>`, so this validates one row and
 * saveBudgets maps it over the parsed entries — there is no whole-form schema
 * because the field set is data-driven rather than fixed.
 */
export const budgetLimitSchema = z.object({
  category_id: z.uuid(),
  amount: z.coerce.number().positive("Budget must be greater than zero"),
});

export type BudgetLimitInput = z.infer<typeof budgetLimitSchema>;

/** The `amount:<categoryId>` field-name convention, in one place. */
export const BUDGET_FIELD_PREFIX = "amount:";

export type ParsedBudgetGrid = {
  /** Categories given a limit, ready to upsert. */
  limits: BudgetLimitInput[];
  /** Categories whose input was left blank — their budget row is deleted. */
  cleared: string[];
};

/**
 * Splits a grid submission into rows to upsert and rows to delete, or returns
 * the first validation message. A blank input is not an error: it is how the
 * user says "no limit for this category", which is the grid's only delete
 * affordance.
 */
export function parseBudgetGrid(formData: FormData): ParsedBudgetGrid | string {
  const limits: BudgetLimitInput[] = [];
  const cleared: string[] = [];

  for (const [field, value] of formData.entries()) {
    if (!field.startsWith(BUDGET_FIELD_PREFIX)) continue;
    const categoryId = field.slice(BUDGET_FIELD_PREFIX.length);
    const raw = typeof value === "string" ? value.trim() : "";

    if (raw === "") {
      // Still has to be a real category id — a blank drives a delete.
      if (!z.uuid().safeParse(categoryId).success) return "Unrecognized category";
      cleared.push(categoryId);
      continue;
    }

    const parsed = budgetLimitSchema.safeParse({ category_id: categoryId, amount: raw });
    if (!parsed.success) return parsed.error.issues[0].message;
    limits.push(parsed.data);
  }

  return { limits, cleared };
}
