"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/loading-overlay";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { useDirtyFormTracking, useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { BUDGET_FIELD_PREFIX } from "@/lib/validations/budget";
import type { BudgetLine } from "@/lib/calculations";
import { BudgetMeter } from "./budget-meter";

/**
 * Every budgetable category as one form, saved in a single action.
 *
 * A grid rather than the per-row add/edit sheets the other modules use: there
 * are a dozen-odd expense categories and setting limits is one sitting, so
 * a dozen trips through a sheet would be the slowest possible version of the
 * task. Clearing an input is the delete affordance, which is why no row has
 * its own delete button.
 *
 * Read-only when `editable` is false — a past month's spend is history, and
 * offering to "save" limits from inside it implies the limits were per-month,
 * which they are not.
 */
export function BudgetGrid({
  action,
  lines,
  editable,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  lines: BudgetLine[];
  editable: boolean;
}) {
  const [error, formAction, isPending] = useActionState(action, null);
  const { ref: formRef, isDirty } = useDirtyFormTracking();
  const { isConfirmOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  const rows = lines.map((line) => (
    <Card key={line.categoryId} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <div className="sm:w-52">
        <Label htmlFor={`${BUDGET_FIELD_PREFIX}${line.categoryId}`}>{line.categoryName}</Label>
      </div>

      {editable && line.categoryId && (
        <div className="sm:w-40">
          <Input
            id={`${BUDGET_FIELD_PREFIX}${line.categoryId}`}
            name={`${BUDGET_FIELD_PREFIX}${line.categoryId}`}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="No limit"
            defaultValue={line.limit ?? ""}
            aria-label={`Monthly budget for ${line.categoryName}`}
          />
        </div>
      )}

      <div className="flex-1">
        <BudgetMeter line={line} />
      </div>
    </Card>
  ));

  if (!editable) {
    return <div className="flex flex-col gap-3">{rows}</div>;
  }

  return (
    <>
      <form ref={formRef} action={formAction} className="relative flex flex-col gap-3">
        {rows}

        {error && (
          <Alert variant="callout">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save budgets"}
          </Button>
        </div>

        <LoadingOverlay show={isPending} />
      </form>

      <UnsavedChangesDialog open={isConfirmOpen} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </>
  );
}
