import { Eraser } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { iconActionClasses } from "@/components/ui/icon-action";
import { deleteAllAccountTransactions } from "@/app/(app)/transactions/actions";

/**
 * "Clear this account's ledger" action, shared by the accounts list and the
 * transactions landing page. Distinct from deleting the account itself —
 * the account, its settings and its reconciliation history all survive —
 * so it uses an eraser rather than a trash can.
 */
export function DeleteAllTransactionsDialog({
  accountId,
  accountName,
  count,
}: {
  accountId: string;
  accountName: string;
  count?: number;
}) {
  const disabled = count === 0;

  return (
    <DeleteConfirmDialog
      onConfirm={deleteAllAccountTransactions.bind(null, accountId)}
      tooltipLabel="Delete all transactions"
      title="Delete all transactions?"
      description={`This permanently deletes ${
        count === undefined ? "every transaction" : `all ${count} transactions`
      } in "${accountName}". The account itself is kept. Transfers are deleted on both accounts so no matching leg is left behind. This cannot be undone.`}
      trigger={
        <button
          type="button"
          disabled={disabled}
          aria-label={`Delete all transactions in ${accountName}`}
          className={`${iconActionClasses} disabled:opacity-40 disabled:pointer-events-none`}
        >
          <Eraser className="size-4" />
        </button>
      }
    />
  );
}
