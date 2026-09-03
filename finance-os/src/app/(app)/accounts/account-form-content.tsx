import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountForm } from "./account-form";
import { createAccount, updateAccount } from "./actions";

// The form and its data, shared by the full page and the intercepted sheet so
// the two can never disagree about what an account form contains.

export function NewAccountContent() {
  return <AccountForm action={createAccount} submitLabel="Add account" />;
}

export async function EditAccountContent({ id }: { id: string }) {
  const supabase = await createClient();
  const { data: account } = await supabase
    .from("accounts")
    .select(
      "name, institution, type, subtype, balance, credit_limit, interest_rate, minimum_payment, due_day, statement_day, opening_date, notes",
    )
    .eq("id", id)
    .single();

  if (!account) notFound();

  return (
    <AccountForm
      action={updateAccount.bind(null, id)}
      defaultValues={account}
      submitLabel="Save changes"
    />
  );
}

/** The account's name, for the sheet/page title. Cheap enough to fetch twice. */
export async function accountName(id: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("accounts").select("name").eq("id", id).single();
  return data?.name ?? null;
}
