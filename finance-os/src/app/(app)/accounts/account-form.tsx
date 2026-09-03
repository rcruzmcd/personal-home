"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { useDirtyFormTracking, useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { ACCOUNT_TYPES } from "@/lib/validations/account";

type Account = {
  name: string;
  institution: string | null;
  type: string;
  subtype: string | null;
  balance: number;
  credit_limit: number | null;
  interest_rate: number | null;
  minimum_payment: number | null;
  due_day: number | null;
  statement_day: number | null;
  opening_date: string | null;
  notes: string | null;
};

export function AccountForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  defaultValues?: Account;
  submitLabel: string;
}) {
  const [error, formAction, isPending] = useActionState(action, null);
  const { ref: formRef, isDirty } = useDirtyFormTracking();
  const { isConfirmOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  return (
    <>
    <form ref={formRef} action={formAction} className="relative flex flex-col gap-4">
      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Chase Checking"
          defaultValue={defaultValues?.name}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type" required>
            Type
          </Label>
          <select
            id="type"
            name="type"
            required
            defaultValue={defaultValues?.type ?? ""}
            className={inputClasses}
          >
            <option value="" disabled>
              Select a type
            </option>
            {ACCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            name="institution"
            placeholder="Chase"
            defaultValue={defaultValues?.institution ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="balance" required>
            Current balance
          </Label>
          <Input
            id="balance"
            name="balance"
            type="number"
            step="0.01"
            required
            defaultValue={defaultValues?.balance}
          />
        </div>
        <div>
          <Label htmlFor="subtype">Subtype</Label>
          <Input id="subtype" name="subtype" defaultValue={defaultValues?.subtype ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="credit_limit">Credit limit</Label>
          <Input
            id="credit_limit"
            name="credit_limit"
            type="number"
            step="0.01"
            defaultValue={defaultValues?.credit_limit ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="interest_rate">Interest rate (APR %)</Label>
          <Input
            id="interest_rate"
            name="interest_rate"
            type="number"
            step="0.001"
            defaultValue={defaultValues?.interest_rate ?? ""}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="minimum_payment">Minimum payment</Label>
        <Input
          id="minimum_payment"
          name="minimum_payment"
          type="number"
          step="0.01"
          defaultValue={defaultValues?.minimum_payment ?? ""}
        />
      </div>

      {/* Days of the month, not dates: a card closes and falls due on the same
          day every cycle, so a stored date would go stale after one month. */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="statement_day">Statement day</Label>
            <Input
              id="statement_day"
              name="statement_day"
              type="number"
              min={1}
              max={31}
              step={1}
              inputMode="numeric"
              placeholder="17"
              defaultValue={defaultValues?.statement_day ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="due_day">Due day</Label>
            <Input
              id="due_day"
              name="due_day"
              type="number"
              min={1}
              max={31}
              step={1}
              inputMode="numeric"
              placeholder="14"
              defaultValue={defaultValues?.due_day ?? ""}
            />
          </div>
        </div>
        <p className="text-small text-muted">
          Day of the month, 1–31. A day past the 28th falls on the last day of shorter months.
        </p>
      </div>

      <div>
        <Label htmlFor="opening_date">Opening date</Label>
        <Input
          id="opening_date"
          name="opening_date"
          type="date"
          defaultValue={defaultValues?.opening_date ?? ""}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" defaultValue={defaultValues?.notes ?? ""} />
      </div>

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
