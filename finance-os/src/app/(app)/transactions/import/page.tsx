import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ImportWizard } from "./import-wizard";

// Supports an ?accountId= prefill so the accounts list's "Import" link can
// jump straight into the wizard with that account pre-selected.
export default async function ImportTransactionsPage({
  searchParams,
}: PageProps<"/transactions/import">) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name")
    .eq("active", true)
    .order("name");

  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const accountIdParam = first(params?.accountId);
  const initialAccountId = accounts?.some((a) => a.id === accountIdParam)
    ? accountIdParam
    : undefined;

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        breadcrumb={[{ label: "Transactions", href: "/transactions" }]}
        title="Import transactions"
      />

      {!accounts?.length ? (
        <p className="text-body text-muted">Add an account before importing transactions.</p>
      ) : (
        <ImportWizard accounts={accounts} initialAccountId={initialAccountId} />
      )}
    </main>
  );
}
