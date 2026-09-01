import { describe, expect, it } from "vitest";
import { mergeMappedResults } from "../merge-files";
import type { MappedTransaction } from "../types";

function txn(overrides: Partial<MappedTransaction>): MappedTransaction {
  return {
    row: 1,
    date: "2026-01-01",
    description: "Coffee",
    merchant: null,
    amount: -5,
    type: "expense",
    import_id: "acc|2026-01-01|-5|Coffee",
    duplicateInFile: false,
    ...overrides,
  };
}

describe("mergeMappedResults", () => {
  it("tags each transaction with its source file", () => {
    const merged = mergeMappedResults([
      { fileName: "jan.csv", result: { transactions: [txn({})], errors: [] } },
    ]);
    expect(merged.transactions[0].sourceFile).toBe("jan.csv");
  });

  it("flags a transaction as a duplicate if it already appeared in an earlier file", () => {
    const a = txn({ row: 1, import_id: "acc|2026-01-01|-5|Coffee" });
    const b = txn({ row: 1, import_id: "acc|2026-01-01|-5|Coffee" });
    const merged = mergeMappedResults([
      { fileName: "jan.csv", result: { transactions: [a], errors: [] } },
      { fileName: "jan-resend.csv", result: { transactions: [b], errors: [] } },
    ]);
    expect(merged.transactions[0].duplicateInFile).toBe(false);
    expect(merged.transactions[1].duplicateInFile).toBe(true);
  });

  it("preserves a duplicate flag already set within a single file", () => {
    const merged = mergeMappedResults([
      {
        fileName: "jan.csv",
        result: { transactions: [txn({ duplicateInFile: true })], errors: [] },
      },
    ]);
    expect(merged.transactions[0].duplicateInFile).toBe(true);
  });

  it("tags each error with its source file", () => {
    const merged = mergeMappedResults([
      {
        fileName: "jan.csv",
        result: { transactions: [], errors: [{ row: 3, message: "Invalid or missing date" }] },
      },
    ]);
    expect(merged.errors).toEqual([
      { sourceFile: "jan.csv", row: 3, message: "Invalid or missing date" },
    ]);
  });

  it("does not cross-flag distinct transactions as duplicates", () => {
    const a = txn({ import_id: "acc|2026-01-01|-5|Coffee" });
    const b = txn({ import_id: "acc|2026-01-02|-10|Lunch" });
    const merged = mergeMappedResults([
      { fileName: "jan.csv", result: { transactions: [a, b], errors: [] } },
    ]);
    expect(merged.transactions.map((t) => t.duplicateInFile)).toEqual([false, false]);
  });
});
