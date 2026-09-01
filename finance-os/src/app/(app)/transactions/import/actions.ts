"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { matchCategorizationRule } from "@/lib/categorization/rules";
import type { ImportSummary, MappedTransaction } from "@/lib/import/types";

// Rows are already parsed, mapped, and client-validated by the import
// wizard (parse-file.ts / map-rows.ts run in the browser) — this action
// only handles the parts that need the database: deduplication against
// previously imported transactions and rule-based categorization
// (docs/PERSONAL_FINANCE_REQUIREMENTS.md §3 "Deduplicate (detect
// duplicates)" and §4).
export async function importTransactions(
  accountId: string,
  rows: MappedTransaction[],
): Promise<ImportSummary> {
  const candidates = rows.filter((row) => !row.duplicateInFile);
  if (candidates.length === 0) {
    return { imported: 0, duplicates: rows.length, total: rows.length };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("transactions")
    .select("import_id")
    .eq("account_id", accountId)
    .in(
      "import_id",
      candidates.map((row) => row.import_id),
    );
  const existingImportIds = new Set((existing ?? []).map((row) => row.import_id));

  const toInsert = candidates.filter((row) => !existingImportIds.has(row.import_id));
  const duplicates = rows.length - toInsert.length;
  if (toInsert.length === 0) {
    return { imported: 0, duplicates, total: rows.length };
  }

  const { data: rules } = await supabase
    .from("categorization_rules")
    .select("match_field, match_operator, match_value, category_id, subcategory, priority, active")
    .eq("active", true);

  const records = toInsert.map((row) => {
    const category = matchCategorizationRule(
      { merchant: row.merchant, description: row.description },
      rules ?? [],
    );
    return {
      account_id: accountId,
      date: row.date,
      description: row.description,
      merchant: row.merchant,
      amount: row.amount,
      type: row.type,
      category_id: category?.category_id ?? null,
      subcategory: category?.subcategory ?? null,
      import_id: row.import_id,
      original_description: row.description,
    };
  });

  const { error } = await supabase.from("transactions").insert(records);
  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  return { imported: toInsert.length, duplicates, total: rows.length };
}
