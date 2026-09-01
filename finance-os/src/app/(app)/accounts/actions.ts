"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { accountSchema } from "@/lib/validations/account";
import { reconciliationSchema } from "@/lib/validations/reconciliation";

export async function createAccount(_prevState: string | null, formData: FormData) {
  const parsed = accountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { error } = await supabase.from("accounts").insert(parsed.data);
  if (error) return error.message;

  revalidatePath("/accounts");
  redirect("/accounts");
}

export async function updateAccount(
  id: string,
  _prevState: string | null,
  formData: FormData
) {
  const parsed = accountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { error } = await supabase
    .from("accounts")
    .update({ ...parsed.data, last_updated: new Date().toISOString() })
    .eq("id", id);
  if (error) return error.message;

  revalidatePath("/accounts");
  redirect("/accounts");
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();
  await supabase.from("accounts").delete().eq("id", id);
  revalidatePath("/accounts");
}

// Reconciliation (docs/PERSONAL_FINANCE_REQUIREMENTS.md §2, §12): the
// system's current balance is "expected"; the user supplies what the bank
// actually reports. A reconciliations row records the comparison, and the
// account's balance is brought in line with the bank so it stays the
// source of truth going forward — matching how a bank statement reconciles
// a checkbook.
export async function reconcileAccount(
  accountId: string,
  _prevState: string | null,
  formData: FormData,
) {
  const parsed = reconciliationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const supabase = await createClient();
  const { data: account, error: fetchError } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", accountId)
    .single();
  if (fetchError || !account) return fetchError?.message ?? "Account not found.";

  const expectedBalance = account.balance;
  const { bank_balance: bankBalance, explanation, notes } = parsed.data;
  const difference = bankBalance - expectedBalance;

  const { error: insertError } = await supabase.from("reconciliations").insert({
    account_id: accountId,
    expected_balance: expectedBalance,
    bank_balance: bankBalance,
    difference,
    explanation,
    notes,
  });
  if (insertError) return insertError.message;

  const { error: updateError } = await supabase
    .from("accounts")
    .update({ balance: bankBalance, last_updated: new Date().toISOString() })
    .eq("id", accountId);
  if (updateError) return updateError.message;

  revalidatePath("/accounts");
  revalidatePath(`/accounts/${accountId}`);
  redirect(`/accounts/${accountId}`);
}
