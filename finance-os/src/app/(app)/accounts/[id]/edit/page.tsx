import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
import { AccountForm } from "../../account-form";
import { updateAccount } from "../../actions";

export default async function EditAccountPage({
  params,
}: PageProps<"/accounts/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: account } = await supabase
    .from("accounts")
    .select(
      "name, institution, type, subtype, balance, credit_limit, interest_rate, minimum_payment, due_date, statement_date, opening_date, notes"
    )
    .eq("id", id)
    .single();

  if (!account) notFound();

  return (
    <FormPage
      title="Edit account"
      breadcrumb={[
        { label: "Accounts", href: "/accounts" },
        { label: account.name, href: `/accounts/${id}` },
      ]}
    >
      <AccountForm
        action={updateAccount.bind(null, id)}
        defaultValues={account}
        submitLabel="Save changes"
      />
    </FormPage>
  );
}
