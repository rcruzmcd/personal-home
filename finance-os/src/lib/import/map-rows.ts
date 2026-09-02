// Pure column-mapping/validation logic for transaction import, kept
// separate from parse-file.ts (browser-only) and actions.ts (server-only)
// so it's testable without a DOM or a database.
import type { ColumnMapping, MappedTransaction, MapRowsResult, ParsedFile } from "./types";

export function parseAmount(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const negativeByParens = /^\(.*\)$/.test(trimmed);
  const cleaned = trimmed.replace(/[()$,\s]/g, "");
  if (!cleaned || !/^-?\d+(\.\d+)?$/.test(cleaned)) return null;

  const value = Number(cleaned);
  if (Number.isNaN(value) || value === 0) return null;
  return negativeByParens ? -Math.abs(value) : value;
}

export function parseImportDate(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const slash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slash) {
    const [, m, d, y] = slash;
    const year = y.length === 2 ? `20${y}` : y;
    const month = m.padStart(2, "0");
    const day = d.padStart(2, "0");
    const iso = `${year}-${month}-${day}`;
    return isValidCalendarDate(iso) ? iso : null;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function isValidCalendarDate(iso: string): boolean {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

type AmountResult = { amount: number } | { error: string };

/**
 * Resolves a row's signed amount from either a single signed column or a
 * separate debit/credit pair. Debit is money out (always stored negative)
 * and credit is money in (always positive), regardless of how the bank
 * signed them — some export debits as positive magnitudes, some as
 * negatives. A zero or blank cell reads as "not this column", which is how
 * banks that fill both columns mark the unused side.
 */
function resolveAmount(
  cells: string[],
  mapping: ColumnMapping,
  indexes: { amount: number; debit: number; credit: number },
): AmountResult {
  if (mapping.amountMode === "single") {
    const amount = parseAmount(cells[indexes.amount] ?? "");
    return amount === null ? { error: "Invalid or missing amount" } : { amount };
  }

  const debit = indexes.debit >= 0 ? parseAmount(cells[indexes.debit] ?? "") : null;
  const credit = indexes.credit >= 0 ? parseAmount(cells[indexes.credit] ?? "") : null;

  if (debit !== null && credit !== null) {
    return { error: "Row has both a debit and a credit amount" };
  }
  if (debit !== null) return { amount: -Math.abs(debit) };
  if (credit !== null) return { amount: Math.abs(credit) };
  return { error: "Invalid or missing debit/credit amount" };
}

export function mapRowsToTransactions(
  parsed: ParsedFile,
  mapping: ColumnMapping,
  accountId: string,
): MapRowsResult {
  const dateIdx = parsed.headers.indexOf(mapping.date);
  const descIdx = parsed.headers.indexOf(mapping.description);
  const merchantIdx = mapping.merchant ? parsed.headers.indexOf(mapping.merchant) : -1;
  const amountIndexes = {
    amount: parsed.headers.indexOf(mapping.amount),
    debit: mapping.debit ? parsed.headers.indexOf(mapping.debit) : -1,
    credit: mapping.credit ? parsed.headers.indexOf(mapping.credit) : -1,
  };

  const transactions: MappedTransaction[] = [];
  const errors: MapRowsResult["errors"] = [];
  const seenImportIds = new Set<string>();

  parsed.rows.forEach((cells, index) => {
    const row = index + 1;
    const description = (cells[descIdx] ?? "").trim();
    const date = parseImportDate(cells[dateIdx] ?? "");
    const merchant = merchantIdx >= 0 ? (cells[merchantIdx] ?? "").trim() || null : null;

    if (!date) {
      errors.push({ row, message: "Invalid or missing date" });
      return;
    }
    if (!description) {
      errors.push({ row, message: "Missing description" });
      return;
    }

    const resolved = resolveAmount(cells, mapping, amountIndexes);
    if ("error" in resolved) {
      errors.push({ row, message: resolved.error });
      return;
    }
    const { amount } = resolved;

    const import_id = `${accountId}|${date}|${amount}|${description}`;
    const duplicateInFile = seenImportIds.has(import_id);
    seenImportIds.add(import_id);

    transactions.push({
      row,
      date,
      description,
      merchant,
      amount,
      type: amount < 0 ? "expense" : "income",
      import_id,
      duplicateInFile,
    });
  });

  return { transactions, errors };
}
