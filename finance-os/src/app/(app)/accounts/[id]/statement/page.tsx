import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
import { formatShortDate } from "@/lib/format";
import { findPendingStatements, type StatementAccount } from "@/lib/calculations";
import { recordStatement } from "../../actions";
import { StatementForm } from "./statement-form";

// Same yyyy-mm-dd construction the detector uses — never toISOString(), which
// shifts to UTC and lands a day early west of Greenwich.
function isoKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default async function RecordStatementPage({
  params,
}: PageProps<"/accounts/[id]/statement">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: account }, { data: recorded }] = await Promise.all([
    supabase
      .from("accounts")
      .select("id, name, type, active, balance, statement_day, due_day")
      .eq("id", id)
      .single(),
    supabase.from("statements").select("account_id, closing_date").eq("account_id", id),
  ]);

  if (!account) notFound();

  // The cycle to record is derived, not passed in the URL: the page and the
  // prompts that link here must agree on which close is outstanding.
  const [pending] = findPendingStatements({
    accounts: [account as StatementAccount],
    recorded: recorded ?? [],
    asOfDate: new Date(),
  });

  return (
    <FormPage
      title="Record statement"
      breadcrumb={[
        { label: "Accounts", href: "/accounts" },
        { label: account.name, href: `/accounts/${id}` },
      ]}
      description={
        pending
          ? `Closed ${formatShortDate(pending.closingDate)}`
          : undefined
      }
    >
      {!pending ? (
        <p className="text-body text-muted">
          Every statement for this account is already recorded.
        </p>
      ) : (
        <StatementForm
          action={recordStatement.bind(null, id)}
          closingDate={isoKey(pending.closingDate)}
          dueDate={isoKey(pending.dueDate ?? pending.closingDate)}
          currentBalance={account.balance}
        />
      )}
    </FormPage>
  );
}
