"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pillVariant } from "@/components/ui/pill";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { formatCurrency } from "@/lib/format";
import { parseImportFile } from "@/lib/import/parse-file";
import { mapRowsToTransactions } from "@/lib/import/map-rows";
import { mergeMappedResults, type MergedError, type MergedTransaction } from "@/lib/import/merge-files";
import type { ColumnMapping, ImportSummary, ParsedFile } from "@/lib/import/types";
import { importTransactions } from "./actions";

type AccountOption = { id: string; name: string };
type Step = "upload" | "map" | "preview" | "done";

// One file per parsed upload, kept until every group has been mapped.
type ParsedUpload = { fileName: string; parsed: ParsedFile };

// Files sharing an identical header row only need to be mapped once —
// grouping by header signature means N monthly statements from the same
// bank collapse to a single mapping step, while files with a different
// layout (a different bank/export) each get their own.
type FileGroup = {
  key: string;
  headers: string[];
  fileNames: string[];
  sample: ParsedFile;
  mapping: ColumnMapping;
};

function groupByHeaders(uploads: ParsedUpload[]): FileGroup[] {
  const groups: FileGroup[] = [];
  for (const upload of uploads) {
    const key = upload.parsed.headers.join("␟");
    const existing = groups.find((g) => g.key === key);
    if (existing) {
      existing.fileNames.push(upload.fileName);
    } else {
      groups.push({
        key,
        headers: upload.parsed.headers,
        fileNames: [upload.fileName],
        sample: upload.parsed,
        mapping: guessMapping(upload.parsed.headers),
      });
    }
  }
  return groups;
}

// A single signed "Amount" column is the common case, so it wins when
// present; a file that instead splits money out/in across debit and credit
// columns starts in credit/debit mode. Either way the user can switch.
function guessMapping(headers: string[]): ColumnMapping {
  const amount = guessColumn(headers, ["amount"]);
  const debit = guessColumn(headers, ["debit", "withdrawal", "money out"]);
  const credit = guessColumn(headers, ["credit", "deposit", "money in"]);

  return {
    date: guessColumn(headers, ["date"]) ?? "",
    description: guessColumn(headers, ["description", "memo", "name"]) ?? "",
    merchant: guessColumn(headers, ["merchant", "payee"]),
    amountMode: !amount && (debit || credit) ? "credit_debit" : "single",
    amount: amount ?? "",
    debit: debit ?? "",
    credit: credit ?? "",
  };
}

function isAmountMapped(mapping: ColumnMapping): boolean {
  return mapping.amountMode === "single"
    ? Boolean(mapping.amount)
    : Boolean(mapping.debit || mapping.credit);
}

export function ImportWizard({
  accounts,
  initialAccountId,
}: {
  accounts: AccountOption[];
  initialAccountId?: string;
}) {
  const [step, setStep] = useState<Step>("upload");
  const [accountId, setAccountId] = useState(initialAccountId ?? accounts[0]?.id ?? "");
  const [uploads, setUploads] = useState<ParsedUpload[]>([]);
  const [fileGroups, setFileGroups] = useState<FileGroup[]>([]);
  const [mapGroupIndex, setMapGroupIndex] = useState(0);
  const [transactions, setTransactions] = useState<MergedTransaction[]>([]);
  const [mergedErrors, setMergedErrors] = useState<MergedError[]>([]);
  const [excludedKeys, setExcludedKeys] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const rowKey = (t: { sourceFile: string; row: number }) => `${t.sourceFile}::${t.row}`;

  async function handleFilesSelected(files: FileList) {
    setError(null);
    setIsBusy(true);
    try {
      const parsedUploads: ParsedUpload[] = [];
      const failed: string[] = [];
      for (const file of Array.from(files)) {
        try {
          const parsed = await parseImportFile(file);
          if (parsed.headers.length === 0) failed.push(file.name);
          else parsedUploads.push({ fileName: file.name, parsed });
        } catch {
          failed.push(file.name);
        }
      }
      if (parsedUploads.length === 0) {
        setError("Couldn't read any of those files. Make sure they're valid CSV or XLSX exports.");
        return;
      }
      if (failed.length > 0) {
        setError(`Couldn't read: ${failed.join(", ")}. Continuing with the rest.`);
      }
      setUploads(parsedUploads);
      setFileGroups(groupByHeaders(parsedUploads));
      setMapGroupIndex(0);
      setStep("map");
    } finally {
      setIsBusy(false);
    }
  }

  function updateGroupMapping(mapping: ColumnMapping) {
    setFileGroups((groups) =>
      groups.map((g, i) => (i === mapGroupIndex ? { ...g, mapping } : g)),
    );
  }

  function handleNextGroup() {
    const group = fileGroups[mapGroupIndex];
    if (!group.mapping.date || !group.mapping.description || !isAmountMapped(group.mapping)) {
      setError(
        group.mapping.amountMode === "single"
          ? "Map the Date, Description, and Amount columns to continue."
          : "Map the Date and Description columns, plus a Debit and/or Credit column, to continue.",
      );
      return;
    }
    setError(null);
    if (mapGroupIndex < fileGroups.length - 1) {
      setMapGroupIndex((i) => i + 1);
      return;
    }

    const merged = mergeMappedResults(
      uploads.map((upload) => {
        const matchingGroup = fileGroups.find(
          (g) => g.key === upload.parsed.headers.join("␟"),
        )!;
        return {
          fileName: upload.fileName,
          result: mapRowsToTransactions(upload.parsed, matchingGroup.mapping, accountId),
        };
      }),
    );
    setTransactions(merged.transactions);
    setMergedErrors(merged.errors);
    setExcludedKeys(
      new Set(merged.transactions.filter((t) => t.duplicateInFile).map(rowKey)),
    );
    setStep("preview");
  }

  async function handleImport() {
    const rows = transactions.filter((t) => !excludedKeys.has(rowKey(t)));
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

  function toggleRow(key: string) {
    setExcludedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function reset() {
    setStep("upload");
    setUploads([]);
    setFileGroups([]);
    setMapGroupIndex(0);
    setTransactions([]);
    setMergedErrors([]);
    setExcludedKeys(new Set());
    setSummary(null);
    setError(null);
  }

  const includedCount = transactions.filter((t) => !excludedKeys.has(rowKey(t))).length;
  const currentGroup = fileGroups[mapGroupIndex];
  // Progress is held only in memory (useState) — leaving mid-wizard (before
  // "done") loses the parsed/mapped files with no way to recover them.
  const isDirty = step === "map" || step === "preview";
  const { isConfirmOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

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
              Files (CSV or XLSX)
            </Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              multiple
              disabled={isBusy || !accountId}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) void handleFilesSelected(files);
              }}
            />
            <p className="text-small text-muted mt-1">
              Select multiple files at once to import them together — files with matching
              columns only need to be mapped once.
            </p>
          </div>
        </Card>
      )}

      {step === "map" && currentGroup && (
        <Card className="flex flex-col gap-4">
          <div>
            {fileGroups.length > 1 && (
              <p className="text-small text-muted">
                Mapping {mapGroupIndex + 1} of {fileGroups.length}
              </p>
            )}
            <p className="text-body text-muted">
              Match the columns from{" "}
              {currentGroup.fileNames.length > 1
                ? `${currentGroup.fileNames.join(", ")}`
                : currentGroup.fileNames[0]}{" "}
              to transaction fields.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ColumnSelect
              label="Date"
              required
              headers={currentGroup.headers}
              value={currentGroup.mapping.date}
              onChange={(v) => updateGroupMapping({ ...currentGroup.mapping, date: v })}
            />
            <ColumnSelect
              label="Description"
              required
              headers={currentGroup.headers}
              value={currentGroup.mapping.description}
              onChange={(v) => updateGroupMapping({ ...currentGroup.mapping, description: v })}
            />
            <ColumnSelect
              label="Merchant (optional)"
              headers={currentGroup.headers}
              value={currentGroup.mapping.merchant ?? ""}
              onChange={(v) => updateGroupMapping({ ...currentGroup.mapping, merchant: v || null })}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <Label className="mb-0 mr-1" required>
                Amount format
              </Label>
              <button
                type="button"
                className={pillVariant(currentGroup.mapping.amountMode === "single")}
                onClick={() =>
                  updateGroupMapping({ ...currentGroup.mapping, amountMode: "single" })
                }
              >
                One signed column
              </button>
              <button
                type="button"
                className={pillVariant(currentGroup.mapping.amountMode === "credit_debit")}
                onClick={() =>
                  updateGroupMapping({ ...currentGroup.mapping, amountMode: "credit_debit" })
                }
              >
                Separate debit &amp; credit
              </button>
            </div>

            {currentGroup.mapping.amountMode === "single" ? (
              <div className="grid grid-cols-2 gap-4">
                <ColumnSelect
                  label="Amount"
                  required
                  headers={currentGroup.headers}
                  value={currentGroup.mapping.amount}
                  onChange={(v) => updateGroupMapping({ ...currentGroup.mapping, amount: v })}
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <ColumnSelect
                    label="Debit (money out)"
                    headers={currentGroup.headers}
                    value={currentGroup.mapping.debit}
                    onChange={(v) => updateGroupMapping({ ...currentGroup.mapping, debit: v })}
                  />
                  <ColumnSelect
                    label="Credit (money in)"
                    headers={currentGroup.headers}
                    value={currentGroup.mapping.credit}
                    onChange={(v) => updateGroupMapping({ ...currentGroup.mapping, credit: v })}
                  />
                </div>
                <p className="text-small text-muted">
                  Debits import as expenses and credits as income, whichever way the bank signs
                  them. Rows only need one of the two filled in.
                </p>
              </>
            )}
          </div>

          <SamplePreview parsed={currentGroup.sample} />

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={reset}>
              Start over
            </Button>
            <Button onClick={handleNextGroup}>
              {mapGroupIndex < fileGroups.length - 1 ? "Next file" : "Preview transactions"}
            </Button>
          </div>
        </Card>
      )}

      {step === "preview" && (
        <Card className="relative flex flex-col gap-4">
          <p className="text-body text-muted">
            {transactions.length} transactions parsed
            {mergedErrors.length > 0 && `, ${mergedErrors.length} rows skipped`}. Uncheck any you
            don&apos;t want to import — rows flagged as duplicates are unchecked by default.
          </p>

          <div className="flex flex-col divide-y divide-border max-h-[28rem] overflow-y-auto">
            {transactions.map((txn) => {
              const key = rowKey(txn);
              return (
                <label
                  key={key}
                  className="flex items-center justify-between gap-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!excludedKeys.has(key)}
                      onChange={() => toggleRow(key)}
                    />
                    <div>
                      <p className="text-body font-medium text-foreground">
                        {txn.description}
                        {txn.duplicateInFile && (
                          <span className="text-small text-muted"> · duplicate</span>
                        )}
                      </p>
                      <p className="text-small text-muted">
                        {txn.date} · {txn.type}
                        {fileGroups.length > 1 || uploads.length > 1 ? ` · ${txn.sourceFile}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className={`text-body font-semibold ${txn.amount < 0 ? "" : "text-green"}`}>
                    {formatCurrency(txn.amount)}
                  </p>
                </label>
              );
            })}
          </div>

          {mergedErrors.length > 0 && (
            <div>
              <p className="text-small font-medium text-foreground">Skipped rows</p>
              <ul className="text-small text-muted list-disc pl-5">
                {mergedErrors.map((e, i) => (
                  <li key={i}>
                    {e.sourceFile} row {e.row}: {e.message}
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
          <LoadingOverlay show={isBusy} className="rounded-xl" />
        </Card>
      )}

      {step === "done" && summary && (
        <Card className="flex flex-col gap-4">
          <p className="text-h4 font-semibold text-foreground">
            Imported {summary.imported} of {summary.total} transactions
            {uploads.length > 1 && ` from ${uploads.length} files`}
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
      <UnsavedChangesDialog open={isConfirmOpen} onConfirm={confirmLeave} onCancel={cancelLeave} />
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
