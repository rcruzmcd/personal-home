"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { useDirtyFormTracking, useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { RECURRING_FREQUENCIES } from "@/lib/validations/recurring-expense";

type AccountOption = { id: string; name: string };
type CategoryOption = { id: string; name: string };

type RecurringExpense = {
  name: string;
  merchant: string | null;
  amount: number;
  frequency: (typeof RECURRING_FREQUENCIES)[number];
  next_date: string | null;
  category_id: string | null;
  account_id: string | null;
  active: boolean;
};

export function RecurringExpenseForm({
  action,
  accounts,
  categories,
  defaultValues,
  submitLabel,
  transactionIds,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  accounts: AccountOption[];
  categories: CategoryOption[];
  defaultValues?: RecurringExpense;
  submitLabel: string;
  /** Comma-joined ids of the candidate transactions to retroactively link on save (Inbox "Track as recurring"). */
  transactionIds?: string;
}) {
  const [error, formAction, isPending] = useActionState(action, null);
  const { ref: formRef, isDirty } = useDirtyFormTracking();
  const { isConfirmOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  return (
    <>
    <form ref={formRef} action={formAction} className="relative flex flex-col gap-4">
      {transactionIds && <input type="hidden" name="transactionIds" value={transactionIds} />}
      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Netflix"
          defaultValue={defaultValues?.name}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" name="merchant" defaultValue={defaultValues?.merchant ?? ""} />
        </div>
        <div>
          <Label htmlFor="amount" required>
            Amount
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="frequency" required>
            Frequency
          </Label>
          <select
            id="frequency"
            name="frequency"
            required
            defaultValue={defaultValues?.frequency ?? "monthly"}
            className={inputClasses}
          >
            {RECURRING_FREQUENCIES.map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="next_date">Next expected date</Label>
          <Input
            id="next_date"
            name="next_date"
            type="date"
            defaultValue={defaultValues?.next_date ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="account_id">Account</Label>
          <select
            id="account_id"
            name="account_id"
            defaultValue={defaultValues?.account_id ?? ""}
            className={inputClasses}
          >
            <option value="">None</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="category_id">Category</Label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={defaultValues?.category_id ?? ""}
            className={inputClasses}
          >
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label htmlFor="active" className="flex items-center gap-2 text-body text-foreground">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={defaultValues?.active ?? true}
          className="size-4 accent-purple-solid"
        />
        Active
      </label>

      {error && (
        <Alert variant="callout">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : submitLabel}
      </Button>
      <LoadingOverlay show={isPending} />
    </form>
    <UnsavedChangesDialog open={isConfirmOpen} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </>
  );
}
