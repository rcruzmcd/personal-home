import Link from "next/link";
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

export function TransactionRow({ transaction: txn }: { transaction: TransactionRowData }) {
  const categoryName = (txn.categories as unknown as { name: string } | null)?.name;
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
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
      <div className="flex items-center gap-4">
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
      </div>
    </div>
  );
}
