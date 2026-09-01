"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeAmount, transactionSchema } from "@/lib/validations/transaction";
import { matchCategorizationRule } from "@/lib/categorization/rules";
import { matchRecurringExpense } from "@/lib/recurring/matching";
import type { CalcTransactionType } from "@/lib/calculations/types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// A manually chosen category_id is always a user override and wins outright
// (docs/PERSONAL_FINANCE_REQUIREMENTS.md §4, "Fallback: User can manually
// override categorization"). Only fall back to the rule engine when the
// user left the category on "Auto-detect".
async function resolveCategory(
  supabase: SupabaseClient,
  input: {
    category_id?: string;
    subcategory?: string;
    merchant?: string;
    description: string;
  },
): Promise<{ category_id: string | null; subcategory: string | null }> {
  if (input.category_id) {
    return { category_id: input.category_id, subcategory: input.subcategory ?? null };
  }

  const { data: rules } = await supabase
    .from("categorization_rules")
    .select("match_field, match_operator, match_value, category_id, subcategory, priority, active")
    .eq("active", true);

  const match = matchCategorizationRule(
    { merchant: input.merchant ?? null, description: input.description },
    rules ?? [],
  );

  return match ?? { category_id: null, subcategory: null };
}

// Auto-links a transaction to an already-tracked recurring expense
// (transactions.recurring_expense_id) purely by merchant identity — see
// matchRecurringExpense for why amount isn't part of the match.
async function resolveRecurringExpenseId(
  supabase: SupabaseClient,
  input: { merchant?: string; amount: number; type: CalcTransactionType },
): Promise<string | null> {
  if (input.type !== "expense" || !input.merchant) return null;

  const { data: recurringExpenses } = await supabase
    .from("recurring_expenses")
    .select("id, merchant, amount")
    .eq("active", true);

  return matchRecurringExpense(
    { merchant: input.merchant, amount: input.amount, type: input.type },
    recurringExpenses ?? [],
  );
}

export async function createTransaction(_prevState: string | null, formData: FormData) {
  const parsed = transactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const {
    type,
    amount,
    account_id,
    to_account_id,
    date,
    description,
    merchant,
    category_id,
    subcategory,
    tags,
    user_notes,
  } = parsed.data;
  const supabase = await createClient();

  if (type === "transfer") {
    const { error } = await supabase.rpc("create_transfer", {
      p_from_account: account_id,
      p_to_account: to_account_id!,
      p_amount: Math.abs(amount),
      p_date: date,
      p_description: description,
    });
    if (error) return error.message;
  } else {
    const category = await resolveCategory(supabase, {
      category_id,
      subcategory,
      merchant,
      description,
    });
    const normalizedAmount = normalizeAmount(type, amount);
    const recurring_expense_id = await resolveRecurringExpenseId(supabase, {
      merchant,
      amount: normalizedAmount,
      type,
    });
    const { error } = await supabase.from("transactions").insert({
      account_id,
      date,
      description,
      merchant,
      type,
      amount: normalizedAmount,
      category_id: category.category_id,
      subcategory: category.subcategory,
      recurring_expense_id,
      tags,
      user_notes,
    });
    if (error) return error.message;
  }

  revalidatePath("/transactions");
  redirect("/transactions");
}

export type AffectedTransaction = { id: string; date: string; description: string; amount: number };

// Preview for the "learn from this correction" flow below: other
// transactions sharing this exact merchant that are still uncategorized,
// so the UI can show what a new rule would bulk-apply to before doing so.
export async function findUncategorizedByMerchant(
  merchant: string,
  excludeTransactionId?: string,
): Promise<AffectedTransaction[]> {
  const trimmed = merchant.trim();
  if (!trimmed) return [];
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("id, date, description, amount")
    .is("category_id", null)
    .ilike("merchant", trimmed) // case-insensitive exact match, mirrors the "equals" rule operator
    .order("date", { ascending: false });
  if (excludeTransactionId) query = query.neq("id", excludeTransactionId);

  const { data } = await query;
  return data ?? [];
}

// Called when the user manually categorizes a transaction that had no
// category (i.e. the rule engine couldn't place it): remembers the choice
// as an exact-merchant categorization rule for future imports, and
// optionally bulk-applies it to the other uncategorized rows the user
// previewed and confirmed.
export async function learnCategorizationRule(input: {
  merchant: string;
  category_id: string;
  subcategory: string | null;
  applyToTransactionIds: string[];
}) {
  const merchant = input.merchant.trim();
  if (!merchant || !input.category_id) return;
  const supabase = await createClient();

  const { data: existingRules } = await supabase
    .from("categorization_rules")
    .select("id")
    .eq("match_field", "merchant")
    .eq("match_operator", "equals")
    .ilike("match_value", merchant)
    .limit(1);

  if (existingRules?.length) {
    await supabase
      .from("categorization_rules")
      .update({ category_id: input.category_id, subcategory: input.subcategory, active: true })
      .eq("id", existingRules[0].id);
  } else {
    const { data: topPriority } = await supabase
      .from("categorization_rules")
      .select("priority")
      .order("priority", { ascending: false })
      .limit(1)
      .maybeSingle();

    await supabase.from("categorization_rules").insert({
      match_field: "merchant",
      match_operator: "equals",
      match_value: merchant,
      category_id: input.category_id,
      subcategory: input.subcategory,
      priority: (topPriority?.priority ?? 0) + 1,
    });
  }

  if (input.applyToTransactionIds.length > 0) {
    await supabase
      .from("transactions")
      .update({ category_id: input.category_id, subcategory: input.subcategory })
      .in("id", input.applyToTransactionIds);
  }

  revalidatePath("/transactions");
}

export async function updateTransaction(
  id: string,
  _prevState: string | null,
  formData: FormData,
) {
  const parsed = transactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;
  if (parsed.data.type === "transfer") return "Editing transfers isn't supported yet.";

  const {
    type,
    amount,
    account_id,
    date,
    description,
    merchant,
    category_id,
    subcategory,
    tags,
    user_notes,
  } = parsed.data;
  const supabase = await createClient();
  const category = await resolveCategory(supabase, {
    category_id,
    subcategory,
    merchant,
    description,
  });
  const normalizedAmount = normalizeAmount(type, amount);
  const recurring_expense_id = await resolveRecurringExpenseId(supabase, {
    merchant,
    amount: normalizedAmount,
    type,
  });

  const { error } = await supabase
    .from("transactions")
    .update({
      account_id,
      date,
      description,
      merchant,
      type,
      amount: normalizedAmount,
      category_id: category.category_id,
      subcategory: category.subcategory,
      recurring_expense_id,
      tags,
      user_notes,
    })
    .eq("id", id);
  if (error) return error.message;

  revalidatePath("/transactions");
  redirect("/transactions");
}
