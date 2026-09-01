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

export function mapRowsToTransactions(
  parsed: ParsedFile,
  mapping: ColumnMapping,
  accountId: string,
): MapRowsResult {
  const dateIdx = parsed.headers.indexOf(mapping.date);
  const descIdx = parsed.headers.indexOf(mapping.description);
  const amountIdx = parsed.headers.indexOf(mapping.amount);
  const merchantIdx = mapping.merchant ? parsed.headers.indexOf(mapping.merchant) : -1;

  const transactions: MappedTransaction[] = [];
  const errors: MapRowsResult["errors"] = [];
  const seenImportIds = new Set<string>();

  parsed.rows.forEach((cells, index) => {
    const row = index + 1;
    const description = (cells[descIdx] ?? "").trim();
    const date = parseImportDate(cells[dateIdx] ?? "");
    const amount = parseAmount(cells[amountIdx] ?? "");
    const merchant = merchantIdx >= 0 ? (cells[merchantIdx] ?? "").trim() || null : null;

    if (!date) {
      errors.push({ row, message: "Invalid or missing date" });
      return;
    }
    if (!description) {
      errors.push({ row, message: "Missing description" });
      return;
    }
    if (amount === null) {
      errors.push({ row, message: "Invalid or missing amount" });
      return;
    }

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
