"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { useDirtyFormTracking, useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { MATCH_FIELDS, MATCH_OPERATORS, type MatchField, type MatchOperator } from "@/lib/categorization/rules";

type CategoryOption = { id: string; name: string };

type Rule = {
  match_field: MatchField;
  match_operator: MatchOperator;
  match_value: string;
  category_id: string;
  subcategory: string | null;
  priority: number;
  active: boolean;
};

export function RuleForm({
  action,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  categories: CategoryOption[];
  defaultValues?: Rule;
  submitLabel: string;
}) {
  const [error, formAction, isPending] = useActionState(action, null);
  const { ref: formRef, isDirty } = useDirtyFormTracking();
  const { isConfirmOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  return (
    <>
    <form ref={formRef} action={formAction} className="relative flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="match_field" required>
            Match field
          </Label>
          <select
            id="match_field"
            name="match_field"
            required
            defaultValue={defaultValues?.match_field ?? "merchant"}
            className={inputClasses}
          >
            {MATCH_FIELDS.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="match_operator" required>
            Match operator
          </Label>
          <select
            id="match_operator"
            name="match_operator"
            required
            defaultValue={defaultValues?.match_operator ?? "contains"}
            className={inputClasses}
          >
            {MATCH_OPERATORS.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="match_value" required>
          Match value
        </Label>
        <Input
          id="match_value"
          name="match_value"
          required
          placeholder="UBER"
          defaultValue={defaultValues?.match_value}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category_id" required>
            Category
          </Label>
          <select
            id="category_id"
            name="category_id"
            required
            defaultValue={defaultValues?.category_id ?? ""}
            className={inputClasses}
          >
            <option value="" disabled>
              Select a category
            </option>
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
            placeholder="Rideshare"
            defaultValue={defaultValues?.subcategory ?? ""}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="priority" required>
          Priority
        </Label>
        <Input
          id="priority"
          name="priority"
          type="number"
          step="1"
          required
          defaultValue={defaultValues?.priority ?? 0}
        />
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
