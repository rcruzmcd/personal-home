// Merges the per-file output of mapRowsToTransactions (map-rows.ts) into one
// combined batch for the multi-file import wizard. Kept separate from
// map-rows.ts (which only knows about a single file) so duplicate detection
// can be recomputed across files, not just within one.
import type { MapRowsResult, MappedTransaction } from "./types";

export type MergedTransaction = MappedTransaction & { sourceFile: string };
export type MergedError = { sourceFile: string; row: number; message: string };

export type MergedResult = {
  transactions: MergedTransaction[];
  errors: MergedError[];
};

export function mergeMappedResults(
  results: { fileName: string; result: MapRowsResult }[],
): MergedResult {
  const seenImportIds = new Set<string>();
  const transactions: MergedTransaction[] = [];
  const errors: MergedError[] = [];

  for (const { fileName, result } of results) {
    for (const txn of result.transactions) {
      const duplicateInFile = txn.duplicateInFile || seenImportIds.has(txn.import_id);
      seenImportIds.add(txn.import_id);
      transactions.push({ ...txn, sourceFile: fileName, duplicateInFile });
    }
    for (const e of result.errors) {
      errors.push({ sourceFile: fileName, ...e });
    }
  }

  return { transactions, errors };
}
