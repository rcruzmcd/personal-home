"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recurringExpenseSchema } from "@/lib/validations/recurring-expense";

export async function createRecurringExpense(_prevState: string | null, formData: FormData) {
  const parsed = recurringExpenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("recurring_expenses")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error) return error.message;

  // Not a recurring_expenses column — a candidate confirmed from the Inbox
  // (§11 "Track as recurring") carries the matched transaction ids here so
  // they get retroactively linked instead of only the new record existing
  // in isolation.
  const transactionIds = String(formData.get("transactionIds") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (transactionIds.length > 0) {
    await supabase
      .from("transactions")
      .update({ recurring_expense_id: inserted.id })
      .in("id", transactionIds);
    revalidatePath("/transactions");
  }

  revalidatePath("/recurring");
  redirect("/recurring");
}

export async function updateRecurringExpense(
  id: string,
  _prevState: string | null,
  formData: FormData,
) {
  const parsed = recurringExpenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { error } = await supabase.from("recurring_expenses").update(parsed.data).eq("id", id);
  if (error) return error.message;

  revalidatePath("/recurring");
  redirect("/recurring");
}

export async function deleteRecurringExpense(id: string) {
  const supabase = await createClient();
  await supabase.from("recurring_expenses").delete().eq("id", id);
  revalidatePath("/recurring");
}
