"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { formatShortDate } from "@/lib/format";
import { parseDateOnly } from "@/lib/date";

/**
 * Records what a closed statement said. The dates are fixed rather than
 * editable — the app derived this cycle from the account's statement day, so
 * the user is confirming figures for a known close, not choosing when it was.
 */
export function StatementForm({
  action,
  closingDate,
  dueDate,
  currentBalance,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  closingDate: string;
  dueDate: string;
  currentBalance: number;
}) {
  const [error, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="relative flex flex-col gap-4">
      <input type="hidden" name="closing_date" value={closingDate} />
      <input type="hidden" name="due_date" value={dueDate} />

      <div className="flex items-center justify-between">
        <p className="text-body text-muted">Statement closed</p>
        <p className="text-body font-medium text-foreground">
          {formatShortDate(parseDateOnly(closingDate))}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-body text-muted">Payment due</p>
        <p className="text-body font-medium text-foreground">
          {formatShortDate(parseDateOnly(dueDate))}
        </p>
      </div>

      <div>
        <Label htmlFor="statement_balance" required>
          Statement balance
        </Label>
        <Input
          id="statement_balance"
          name="statement_balance"
          type="number"
          step="0.01"
          required
          defaultValue={currentBalance}
        />
      </div>

      <div>
        <Label htmlFor="minimum_payment" required>
          Minimum payment
        </Label>
        <Input
          id="minimum_payment"
          name="minimum_payment"
          type="number"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>

      {error && (
        <Alert variant="callout">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Record statement"}
      </Button>
      <LoadingOverlay show={isPending} />
    </form>
  );
}
