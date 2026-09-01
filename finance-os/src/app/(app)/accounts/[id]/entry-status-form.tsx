"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function EntryStatusForm({
  action,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
}) {
  const [error, formAction, isPending] = useActionState(action, null);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex-1">
        <Label htmlFor="entered_through">Entered through</Label>
        <Input id="entered_through" name="entered_through" type="date" required defaultValue={today} />
      </div>

      {error && (
        <Alert variant="callout">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Mark entered"}
      </Button>
    </form>
  );
}
