import Link from "next/link";
import type { ReactNode } from "react";
import { formatCurrency } from "@/lib/format";

export type TransactionRowData = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  tags: string[] | null;
  user_notes: string | null;
  categories: unknown;
};

/**
 * Presentational transaction row. `leading` and `actions` are slots so
 * callers can add selection/row actions (see transaction-list.tsx) without
 * this component needing to know about selection or deletion.
 */
export function TransactionRow({
  transaction: txn,
  leading,
  actions,
}: {
  transaction: TransactionRowData;
  leading?: ReactNode;
  actions?: ReactNode;
}) {
  const categoryName = (txn.categories as unknown as { name: string } | null)?.name;
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
        {leading}
        <div className="min-w-0">
          <p className="text-body font-medium text-foreground">{txn.description}</p>
          <p className="text-small text-muted">
            {txn.date} · {txn.type}
            {categoryName ? ` · ${categoryName}` : ""}
          </p>
          {(txn.tags?.length || txn.user_notes) && (
            <div className="flex items-center gap-2 mt-1">
              {txn.tags?.map((tag) => (
                <span key={tag} className="text-small text-purple bg-purple/10 rounded-full px-2 py-0.5">
                  {tag}
                </span>
              ))}
              {txn.user_notes && (
                <p className="text-small text-muted italic truncate max-w-xs">{txn.user_notes}</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <p className={`text-h4 font-semibold ${txn.amount < 0 ? "text-foreground" : "text-green"}`}>
          {formatCurrency(txn.amount)}
        </p>
        {txn.type !== "transfer" && (
          <Link
            href={`/transactions/${txn.id}/edit`}
            className="text-body font-medium text-purple underline"
          >
            Edit
          </Link>
        )}
        {actions}
      </div>
    </div>
  );
}
