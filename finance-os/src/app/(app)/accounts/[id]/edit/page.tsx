import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
      "name, institution, type, subtype, balance, credit_limit, interest_rate, minimum_payment, opening_date, notes"
    )
    .eq("id", id)
    .single();

  if (!account) notFound();

  return (
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit account</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm
            action={updateAccount.bind(null, id)}
            defaultValues={account}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </main>
  );
}
