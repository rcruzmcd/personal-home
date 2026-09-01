"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TRANSACTION_TYPES } from "@/lib/validations/transaction";

type AccountOption = { id: string; name: string };
type CategoryOption = { id: string; name: string };

type Transaction = {
  type: (typeof TRANSACTION_TYPES)[number];
  account_id: string;
  date: string;
  description: string;
  merchant: string | null;
  amount: number;
  category_id: string | null;
  subcategory: string | null;
  tags: string[] | null;
  user_notes: string | null;
};

export function TransactionForm({
  action,
  accounts,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  accounts: AccountOption[];
  categories: CategoryOption[];
  defaultValues?: Transaction;
  submitLabel: string;
}) {
  const [error, formAction, isPending] = useActionState(action, null);
  const [type, setType] = useState<(typeof TRANSACTION_TYPES)[number]>(
    defaultValues?.type ?? "expense",
  );
  // Transfers are two linked ledger rows (see create_transfer) — editing
  // one leg in place isn't supported yet, so an edit form never offers it.
  const availableTypes = defaultValues
    ? TRANSACTION_TYPES.filter((t) => t !== "transfer")
    : TRANSACTION_TYPES;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type" required>
            Type
          </Label>
          <select
            id="type"
            name="type"
            required
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className={inputClasses}
          >
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="date" required>
            Date
          </Label>
          <Input id="date" name="date" type="date" required defaultValue={defaultValues?.date} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="account_id" required>
            {type === "transfer" ? "From account" : "Account"}
          </Label>
          <select
            id="account_id"
            name="account_id"
            required
            defaultValue={defaultValues?.account_id}
            className={inputClasses}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        {type === "transfer" && (
          <div>
            <Label htmlFor="to_account_id" required>
              To account
            </Label>
            <select id="to_account_id" name="to_account_id" required className={inputClasses}>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="description" required>
          Description
        </Label>
        <Input
          id="description"
          name="description"
          required
          placeholder="Whole Foods"
          defaultValue={defaultValues?.description}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" name="merchant" defaultValue={defaultValues?.merchant ?? ""} />
        </div>
        <div>
          <Label htmlFor="amount" required>
            Amount {type !== "transfer" && type !== "adjustment" && "(enter as positive)"}
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            required
            defaultValue={defaultValues?.amount}
          />
        </div>
      </div>

      {type !== "transfer" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category_id">Category</Label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={defaultValues?.category_id ?? ""}
              className={inputClasses}
            >
              <option value="">Auto-detect (rule-based)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              name="subcategory"
              placeholder="Groceries"
              defaultValue={defaultValues?.subcategory ?? ""}
            />
          </div>
        </div>
      )}

      {type !== "transfer" && (
        <>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="reimbursable, vacation"
              defaultValue={defaultValues?.tags?.join(", ") ?? ""}
            />
          </div>

          <div>
            <Label htmlFor="user_notes">Notes</Label>
            <Textarea
              id="user_notes"
              name="user_notes"
              defaultValue={defaultValues?.user_notes ?? ""}
            />
          </div>
        </>
      )}

      {error && (
        <Alert variant="callout">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
