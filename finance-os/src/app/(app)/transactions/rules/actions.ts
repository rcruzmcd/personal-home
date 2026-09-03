"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorizationRuleSchema } from "@/lib/validations/categorization-rule";

export async function createRule(_prevState: string | null, formData: FormData) {
  const parsed = categorizationRuleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { error } = await supabase.from("categorization_rules").insert(parsed.data);
  if (error) return error.message;

  revalidatePath("/transactions/rules");
  redirect("/transactions/rules", "replace");
}

export async function updateRule(id: string, _prevState: string | null, formData: FormData) {
  const parsed = categorizationRuleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { error } = await supabase
    .from("categorization_rules")
    .update(parsed.data)
    .eq("id", id);
  if (error) return error.message;

  revalidatePath("/transactions/rules");
  redirect("/transactions/rules", "replace");
}

export async function deleteRule(id: string) {
  const supabase = await createClient();
  await supabase.from("categorization_rules").delete().eq("id", id);
  revalidatePath("/transactions/rules");
}

export async function toggleRuleActive(id: string, currentActive: boolean) {
  const supabase = await createClient();
  await supabase.from("categorization_rules").update({ active: !currentActive }).eq("id", id);
  revalidatePath("/transactions/rules");
}
