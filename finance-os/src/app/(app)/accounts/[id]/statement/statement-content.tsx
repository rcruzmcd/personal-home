import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

/** The outstanding cycle for an account, or null when there is nothing to record. */
export async function pendingStatementFor(id: string) {
  const supabase = await createClient();
  const [{ data: account }, { data: recorded }] = await Promise.all([
    supabase
      .from("accounts")
      .select("id, name, type, active, balance, statement_day, due_day")
      .eq("id", id)
      .single(),
    supabase.from("statements").select("account_id, closing_date").eq("account_id", id),
  ]);
  if (!account) return null;

  // Derived, not passed in the URL, so this page and the prompts linking here
  // can never disagree about which close is outstanding.
  const [pending] = findPendingStatements({
    accounts: [account as StatementAccount],
    recorded: recorded ?? [],
    asOfDate: new Date(),
  });
  return { account, pending };
}

export async function StatementContent({ id }: { id: string }) {
  const result = await pendingStatementFor(id);
  if (!result) notFound();
  const { account, pending } = result;

  if (!pending) {
    return (
      <p className="text-body text-muted">
        Every statement for this account is already recorded.
      </p>
    );
  }

  return (
    <StatementForm
      action={recordStatement.bind(null, id)}
      closingDate={isoKey(pending.closingDate)}
      dueDate={isoKey(pending.dueDate ?? pending.closingDate)}
      currentBalance={account.balance}
    />
  );
}
