"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recurringExpenseSchema } from "@/lib/validations/recurring-expense";

export async function createRecurringExpense(_prevState: string | null, formData: FormData) {
  const parsed = recurringExpenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { error } = await supabase.from("recurring_expenses").insert(parsed.data);
  if (error) return error.message;

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
