"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { useDirtyFormTracking, useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import {
  CONFIDENCE_LEVELS,
  INCOME_FREQUENCIES,
  TAX_TREATMENTS,
} from "@/lib/validations/income-source";

type IncomeSource = {
  name: string;
  amount: number;
  frequency: (typeof INCOME_FREQUENCIES)[number];
  start_date: string | null;
  end_date: string | null;
  expected_date: string | null;
  confidence: (typeof CONFIDENCE_LEVELS)[number];
  tax_treatment: (typeof TAX_TREATMENTS)[number];
  notes: string | null;
};

export function IncomeSourceForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  defaultValues?: IncomeSource;
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
          placeholder="ADP Salary"
          defaultValue={defaultValues?.name}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            {INCOME_FREQUENCIES.map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="confidence" required>
            Confidence
          </Label>
          <select
            id="confidence"
            name="confidence"
            required
            defaultValue={defaultValues?.confidence ?? "likely"}
            className={inputClasses}
          >
            {CONFIDENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="tax_treatment" required>
            Tax treatment
          </Label>
          <select
            id="tax_treatment"
            name="tax_treatment"
            required
            defaultValue={defaultValues?.tax_treatment ?? "taxable"}
            className={inputClasses}
          >
            {TAX_TREATMENTS.map((treatment) => (
              <option key={treatment} value={treatment}>
                {treatment.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="start_date">Start date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={defaultValues?.start_date ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="end_date">End date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={defaultValues?.end_date ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="expected_date">Expected date</Label>
          <Input
            id="expected_date"
            name="expected_date"
            type="date"
            defaultValue={defaultValues?.expected_date ?? ""}
          />
        </div>
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
