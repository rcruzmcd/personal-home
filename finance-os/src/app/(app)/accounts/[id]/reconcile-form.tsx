"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { formatCurrency } from "@/lib/format";
import { RECONCILIATION_EXPLANATIONS } from "@/lib/validations/reconciliation";

const EXPLANATION_LABEL: Record<string, string> = {
  pending_transaction: "Pending transaction",
  rounding: "Rounding",
  input_error: "Input error",
  other: "Other",
};

export function ReconcileForm({
  action,
  expectedBalance,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  expectedBalance: number;
}) {
  const [error, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="relative flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-body text-muted">Expected balance</p>
        <p className="text-body font-medium text-foreground">{formatCurrency(expectedBalance)}</p>
      </div>

      <div>
        <Label htmlFor="bank_balance" required>
          Bank balance
        </Label>
        <Input id="bank_balance" name="bank_balance" type="number" step="0.01" required />
      </div>

      <div>
        <Label htmlFor="explanation">Explanation for any difference</Label>
        <select id="explanation" name="explanation" defaultValue="" className={inputClasses}>
          <option value="">—</option>
          {RECONCILIATION_EXPLANATIONS.map((explanation) => (
            <option key={explanation} value={explanation}>
              {EXPLANATION_LABEL[explanation]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" />
      </div>

      {error && (
        <Alert variant="callout">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Reconciling…" : "Reconcile"}
      </Button>
      <LoadingOverlay show={isPending} />
    </form>
  );
}
