import { describe, expect, it } from "vitest";
import { findTransferPartnerIds, type TransferLeg } from "../transfer-legs";

const leg = (over: Partial<TransferLeg> & { id: string }): TransferLeg => ({
  account_id: "checking",
  date: "2026-08-01",
  description: "Move to savings",
  amount: -500,
  type: "transfer",
  ...over,
});

describe("findTransferPartnerIds", () => {
  it("finds the opposite leg on the other account", () => {
    const selected = [leg({ id: "out" })];
    const candidates = [
      ...selected,
      leg({ id: "in", account_id: "savings", amount: 500 }),
      leg({ id: "unrelated", account_id: "savings", amount: 250 }),
    ];

    expect(findTransferPartnerIds(selected, candidates)).toEqual(["in"]);
  });

  it("ignores non-transfer rows", () => {
    const selected = [leg({ id: "expense", type: "expense", amount: -500 })];
    const candidates = [...selected, leg({ id: "in", account_id: "savings", amount: 500 })];

    expect(findTransferPartnerIds(selected, candidates)).toEqual([]);
  });

  it("never returns a row that was already selected", () => {
    const selected = [leg({ id: "out" }), leg({ id: "in", account_id: "savings", amount: 500 })];

    expect(findTransferPartnerIds(selected, selected)).toEqual([]);
  });

  it("pairs identical same-day transfers one-to-one", () => {
    const selected = [leg({ id: "out-1" }), leg({ id: "out-2" })];
    const candidates = [
      ...selected,
      leg({ id: "in-1", account_id: "savings", amount: 500 }),
      leg({ id: "in-2", account_id: "savings", amount: 500 }),
    ];

    expect(findTransferPartnerIds(selected, candidates).sort()).toEqual(["in-1", "in-2"]);
  });

  it("won't match a leg on the same account", () => {
    const selected = [leg({ id: "out" })];
    const candidates = [...selected, leg({ id: "same-account", amount: 500 })];

    expect(findTransferPartnerIds(selected, candidates)).toEqual([]);
  });
});
