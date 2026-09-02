"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { TransactionRow, type TransactionRowData } from "../../transaction-row";
import { deleteTransaction, deleteTransactions } from "../../actions";

const rowActionClasses =
  "inline-flex items-center justify-center size-9 rounded-md text-muted hover:text-purple hover:bg-border transition-colors duration-200";

/**
 * The account's transactions for the current page, selectable for bulk
 * deletion. Selection is deliberately page-scoped: what the user can see
 * checked is exactly what a bulk delete removes — "delete everything in
 * this account" is a separate, explicit action on the account list.
 */
export function TransactionList({
  accountId,
  transactions,
}: {
  accountId: string;
  transactions: TransactionRowData[];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selected = new Set(selectedIds);
  const visibleSelected = transactions.filter((txn) => selected.has(txn.id));
  const allSelected = transactions.length > 0 && visibleSelected.length === transactions.length;

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : transactions.map((txn) => txn.id));
  }

  async function deleteSelected() {
    await deleteTransactions(visibleSelected.map((txn) => txn.id), accountId);
    setSelectedIds([]);
  }

  const hasTransfer = visibleSelected.some((txn) => txn.type === "transfer");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4 min-h-9">
        <div className="flex items-center gap-3">
          {/* Label sits beside the checkbox rather than wrapping it: Radix's
              checkbox is a <button>, and a wrapping label would forward the
              click to it on top of its own, toggling twice. */}
          <Checkbox
            id="select-all-transactions"
            checked={allSelected ? true : visibleSelected.length > 0 ? "indeterminate" : false}
            onCheckedChange={toggleAll}
          />
          <Label htmlFor="select-all-transactions" className="mb-0 text-small text-muted">
            {visibleSelected.length > 0
              ? `${visibleSelected.length} selected`
              : "Select all on this page"}
          </Label>
        </div>
        {visibleSelected.length > 0 && (
          <DeleteConfirmDialog
            onConfirm={deleteSelected}
            title={`Delete ${visibleSelected.length} transaction${visibleSelected.length === 1 ? "" : "s"}?`}
            description={
              `This permanently deletes the selected transaction${visibleSelected.length === 1 ? "" : "s"}.` +
              (hasTransfer
                ? " Transfers are deleted on both accounts so the matching leg isn't left behind."
                : "") +
              " This cannot be undone."
            }
            trigger={
              <Button type="button" variant="secondary" className="py-2 text-small">
                Delete selected
              </Button>
            }
          />
        )}
      </div>

      <div className="flex flex-col divide-y divide-border bg-surface rounded-xl">
        {transactions.map((txn) => (
          <TransactionRow
            key={txn.id}
            transaction={txn}
            leading={
              <Checkbox
                checked={selected.has(txn.id)}
                onCheckedChange={() => toggle(txn.id)}
                aria-label={`Select ${txn.description}`}
              />
            }
            actions={
              <DeleteConfirmDialog
                onConfirm={() => deleteTransaction(txn.id, accountId)}
                tooltipLabel="Delete"
                title="Delete this transaction?"
                description={
                  `This permanently deletes "${txn.description}".` +
                  (txn.type === "transfer"
                    ? " Its matching leg on the other account is deleted too."
                    : "") +
                  " This cannot be undone."
                }
                trigger={
                  <button
                    type="button"
                    aria-label={`Delete ${txn.description}`}
                    className={rowActionClasses}
                  >
                    <Trash2 className="size-4" />
                  </button>
                }
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
