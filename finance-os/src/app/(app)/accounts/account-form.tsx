"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  due_date: string | null;
  statement_date: string | null;
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

  return (
    <form action={formAction} className="flex flex-col gap-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="statement_date">Statement date</Label>
          <Input
            id="statement_date"
            name="statement_date"
            type="date"
            defaultValue={defaultValues?.statement_date ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="due_date">Due date</Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            defaultValue={defaultValues?.due_date ?? ""}
          />
        </div>
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
    </form>
  );
}
