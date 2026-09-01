"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { incomeSourceSchema } from "@/lib/validations/income-source";

export async function createIncomeSource(_prevState: string | null, formData: FormData) {
  const parsed = incomeSourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { error } = await supabase.from("income_sources").insert(parsed.data);
  if (error) return error.message;

  revalidatePath("/income");
  redirect("/income");
}

export async function updateIncomeSource(
  id: string,
  _prevState: string | null,
  formData: FormData,
) {
  const parsed = incomeSourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { error } = await supabase.from("income_sources").update(parsed.data).eq("id", id);
  if (error) return error.message;

  revalidatePath("/income");
  redirect("/income");
}

export async function deleteIncomeSource(id: string) {
  const supabase = await createClient();
  await supabase.from("income_sources").delete().eq("id", id);
  revalidatePath("/income");
}
