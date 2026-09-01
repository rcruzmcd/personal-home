import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LIABILITY_ACCOUNT_TYPES } from "@/lib/calculations";
import { DebtPayoffCalculator } from "./debt-payoff-calculator";

export default async function DebtPayoffPage() {
  const supabase = await createClient();
  const { data: accountRows } = await supabase
    .from("accounts")
    .select("id, name, balance, active, interest_rate, minimum_payment")
    .eq("active", true)
    .in("type", LIABILITY_ACCOUNT_TYPES)
    .order("balance", { ascending: false });

  const debts = accountRows ?? [];

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-bold text-purple">Payoff calculator</h1>
        <Link href="/debt" className="text-body font-medium text-purple underline">
          Back to debt dashboard
        </Link>
      </div>

      {debts.length === 0 ? (
        <p className="text-body text-muted">No debt accounts to plan a payoff for.</p>
      ) : (
        <DebtPayoffCalculator debts={debts} />
      )}
    </main>
  );
}
