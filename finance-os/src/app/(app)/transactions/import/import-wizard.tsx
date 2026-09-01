"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/format";
import { parseImportFile } from "@/lib/import/parse-file";
import { mapRowsToTransactions } from "@/lib/import/map-rows";
import type { ColumnMapping, ImportSummary, MapRowsResult, ParsedFile } from "@/lib/import/types";
import { importTransactions } from "./actions";

type AccountOption = { id: string; name: string };
type Step = "upload" | "map" | "preview" | "done";

const EMPTY_MAPPING: ColumnMapping = { date: "", description: "", amount: "", merchant: null };

export function ImportWizard({
  accounts,
  initialAccountId,
}: {
  accounts: AccountOption[];
  initialAccountId?: string;
}) {
  const [step, setStep] = useState<Step>("upload");
  const [accountId, setAccountId] = useState(initialAccountId ?? accounts[0]?.id ?? "");
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>(EMPTY_MAPPING);
  const [mapResult, setMapResult] = useState<MapRowsResult | null>(null);
  const [excludedRows, setExcludedRows] = useState<Set<number>>(new Set());
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleFileSelected(file: File) {
    setError(null);
    setIsBusy(true);
    try {
      const result = await parseImportFile(file);
      if (result.headers.length === 0) {
        setError("Couldn't find any data in that file.");
        return;
      }
      setParsed(result);
      setMapping({
        date: guessColumn(result.headers, ["date"]) ?? "",
        description: guessColumn(result.headers, ["description", "memo", "name"]) ?? "",
        amount: guessColumn(result.headers, ["amount"]) ?? "",
        merchant: guessColumn(result.headers, ["merchant", "payee"]),
      });
      setStep("map");
    } catch {
      setError("Couldn't read that file. Make sure it's a valid CSV or XLSX export.");
    } finally {
      setIsBusy(false);
    }
  }

  function handlePreview() {
    if (!parsed) return;
    if (!mapping.date || !mapping.description || !mapping.amount) {
      setError("Map the Date, Description, and Amount columns to continue.");
      return;
    }
    setError(null);
    const result = mapRowsToTransactions(parsed, mapping, accountId);
    setMapResult(result);
    setExcludedRows(
      new Set(result.transactions.filter((t) => t.duplicateInFile).map((t) => t.row)),
    );
    setStep("preview");
  }

  async function handleImport() {
    if (!mapResult) return;
    const rows = mapResult.transactions.filter((t) => !excludedRows.has(t.row));
    if (rows.length === 0) {
      setError("Select at least one transaction to import.");
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      const result = await importTransactions(accountId, rows);
      setSummary(result);
      setStep("done");
    } catch {
      setError("Import failed. Nothing was saved — try again.");
    } finally {
      setIsBusy(false);
    }
  }

  function toggleRow(row: number) {
    setExcludedRows((prev) => {
      const next = new Set(prev);
      if (next.has(row)) next.delete(row);
      else next.add(row);
      return next;
    });
  }

  function reset() {
    setStep("upload");
    setParsed(null);
    setMapping(EMPTY_MAPPING);
    setMapResult(null);
    setExcludedRows(new Set());
    setSummary(null);
    setError(null);
  }

  const includedCount = mapResult
    ? mapResult.transactions.filter((t) => !excludedRows.has(t.row)).length
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <Alert variant="callout">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === "upload" && (
        <Card className="flex flex-col gap-4">
          <div>
            <Label htmlFor="account" required>
              Account
            </Label>
            <select
              id="account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className={inputClasses}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="file" required>
              File (CSV or XLSX)
            </Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              disabled={isBusy || !accountId}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileSelected(file);
              }}
            />
          </div>
        </Card>
      )}

      {step === "map" && parsed && (
        <Card className="flex flex-col gap-4">
          <p className="text-body text-muted">
            Match the columns from your file to transaction fields.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <ColumnSelect
              label="Date"
              required
              headers={parsed.headers}
              value={mapping.date}
              onChange={(v) => setMapping((m) => ({ ...m, date: v }))}
            />
            <ColumnSelect
              label="Description"
              required
              headers={parsed.headers}
              value={mapping.description}
              onChange={(v) => setMapping((m) => ({ ...m, description: v }))}
            />
            <ColumnSelect
              label="Amount"
              required
              headers={parsed.headers}
              value={mapping.amount}
              onChange={(v) => setMapping((m) => ({ ...m, amount: v }))}
            />
            <ColumnSelect
              label="Merchant (optional)"
              headers={parsed.headers}
              value={mapping.merchant ?? ""}
              onChange={(v) => setMapping((m) => ({ ...m, merchant: v || null }))}
            />
          </div>

          <SamplePreview parsed={parsed} />

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={reset}>
              Start over
            </Button>
            <Button onClick={handlePreview}>Preview transactions</Button>
          </div>
        </Card>
      )}

      {step === "preview" && mapResult && (
        <Card className="flex flex-col gap-4">
          <p className="text-body text-muted">
            {mapResult.transactions.length} transactions parsed
            {mapResult.errors.length > 0 && `, ${mapResult.errors.length} rows skipped`}. Uncheck
            any you don&apos;t want to import — rows flagged as duplicates are unchecked by
            default.
          </p>

          <div className="flex flex-col divide-y divide-border max-h-[28rem] overflow-y-auto">
            {mapResult.transactions.map((txn) => (
              <label
                key={txn.row}
                className="flex items-center justify-between gap-4 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!excludedRows.has(txn.row)}
                    onChange={() => toggleRow(txn.row)}
                  />
                  <div>
                    <p className="text-body font-medium text-foreground">
                      {txn.description}
                      {txn.duplicateInFile && (
                        <span className="text-small text-muted"> · duplicate in file</span>
                      )}
                    </p>
                    <p className="text-small text-muted">
                      {txn.date} · {txn.type}
                    </p>
                  </div>
                </div>
                <p className={`text-body font-semibold ${txn.amount < 0 ? "" : "text-green"}`}>
                  {formatCurrency(txn.amount)}
                </p>
              </label>
            ))}
          </div>

          {mapResult.errors.length > 0 && (
            <div>
              <p className="text-small font-medium text-foreground">Skipped rows</p>
              <ul className="text-small text-muted list-disc pl-5">
                {mapResult.errors.map((e) => (
                  <li key={e.row}>
                    Row {e.row}: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setStep("map")}>
              Back
            </Button>
            <Button onClick={handleImport} disabled={isBusy || includedCount === 0}>
              {isBusy ? "Importing…" : `Import ${includedCount} transactions`}
            </Button>
          </div>
        </Card>
      )}

      {step === "done" && summary && (
        <Card className="flex flex-col gap-4">
          <p className="text-h4 font-semibold text-foreground">
            Imported {summary.imported} of {summary.total} transactions
          </p>
          {summary.duplicates > 0 && (
            <p className="text-body text-muted">
              Skipped {summary.duplicates} duplicate{summary.duplicates === 1 ? "" : "s"}.
            </p>
          )}
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={reset}>
              Import another file
            </Button>
            <Link href={`/transactions/account/${accountId}`}>
              <Button>View transactions</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

function ColumnSelect({
  label,
  headers,
  value,
  onChange,
  required,
}: {
  label: string;
  headers: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClasses}>
        <option value="">—</option>
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
    </div>
  );
}

function SamplePreview({ parsed }: { parsed: ParsedFile }) {
  const sample = useMemo(() => parsed.rows.slice(0, 3), [parsed]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-small">
        <thead>
          <tr className="text-muted text-left">
            {parsed.headers.map((header) => (
              <th key={header} className="px-2 py-1 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sample.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {row.map((cell, j) => (
                <td key={j} className="px-2 py-1 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function guessColumn(headers: string[], candidates: string[]): string | null {
  const normalized = headers.map((h) => ({ header: h, key: h.trim().toLowerCase() }));
  for (const candidate of candidates) {
    const match = normalized.find((h) => h.key === candidate || h.key.includes(candidate));
    if (match) return match.header;
  }
  return null;
}
