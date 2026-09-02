// A transfer is stored as two rows — a negative leg on the source account
// and a positive leg on the destination account, both written by the
// create_transfer() RPC with the same date and description (see
// supabase/migrations/20260831000001_create_transfer_function.sql). There's
// no foreign key linking the pair, so deleting one leg has to find its
// partner by that shared shape, or the other account would keep a dangling
// half-transfer.
//
// Pure so the matching rules are testable without a database; the caller
// supplies the candidate rows it fetched.

export type TransferLeg = {
  id: string;
  account_id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
};

/**
 * Returns the ids of partner legs for the selected transfer rows: rows on a
 * different account with the same date and description and the exactly
 * opposite amount. Each candidate is claimed at most once, so N identical
 * transfers on the same day pair off one-to-one instead of all matching the
 * same partner. Rows already selected are never returned again.
 */
export function findTransferPartnerIds(
  selected: TransferLeg[],
  candidates: TransferLeg[],
): string[] {
  const selectedIds = new Set(selected.map((row) => row.id));
  const claimed = new Set<string>();

  for (const leg of selected) {
    if (leg.type !== "transfer") continue;
    const partner = candidates.find(
      (candidate) =>
        candidate.type === "transfer" &&
        !selectedIds.has(candidate.id) &&
        !claimed.has(candidate.id) &&
        candidate.account_id !== leg.account_id &&
        candidate.date === leg.date &&
        candidate.description === leg.description &&
        candidate.amount === -leg.amount,
    );
    if (partner) claimed.add(partner.id);
  }

  return [...claimed];
}
