import { createClient } from "@/lib/supabase/server";
import { ImportWizard } from "./import-wizard";

export default async function ImportTransactionsPage() {
  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name")
    .eq("active", true)
    .order("name");

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <h1 className="text-h1 font-bold text-purple">Import transactions</h1>

      {!accounts?.length ? (
        <p className="text-body text-muted">Add an account before importing transactions.</p>
      ) : (
        <ImportWizard accounts={accounts} />
      )}
    </main>
  );
}
