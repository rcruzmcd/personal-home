"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input, inputClasses } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { useDirtyFormTracking, useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard";
import { TRANSACTION_TYPES } from "@/lib/validations/transaction";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  findUncategorizedByMerchant,
  learnCategorizationRule,
  type AffectedTransaction,
} from "./actions";

type AccountOption = { id: string; name: string };
type CategoryOption = {
  id: string;
  name: string;
  /** Present only for categories with a budget — drives the remaining-budget hint. */
  budget?: { limit: number; spent: number; remaining: number };
};

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

type RulePreview = {
  formData: FormData;
  matches: AffectedTransaction[];
  merchant: string;
  categoryId: string;
  categoryName: string;
  subcategory: string | null;
};

export function TransactionForm({
  action,
  accounts,
  categories,
  defaultValues,
  submitLabel,
  transactionId,
}: {
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  accounts: AccountOption[];
  categories: CategoryOption[];
  defaultValues?: Transaction;
  submitLabel: string;
  transactionId?: string;
}) {
  const [error, formAction, isPending] = useActionState(action, null);
  const [type, setType] = useState<(typeof TRANSACTION_TYPES)[number]>(
    defaultValues?.type ?? "expense",
  );
  // Controlled so the remaining-budget hint can follow the selection. The
  // submitted value is unchanged — the action still reads category_id off the
  // FormData.
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultValues?.category_id ?? "");
  const selectedBudget = categories.find((c) => c.id === selectedCategoryId)?.budget;
  const [isCheckingRule, setIsCheckingRule] = useState(false);
  const [rulePreview, setRulePreview] = useState<RulePreview | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const { ref: formRef, isDirty } = useDirtyFormTracking();
  const { isConfirmOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);
  // Transfers are two linked ledger rows (see create_transfer) — editing
  // one leg in place isn't supported yet, so an edit form never offers it.
  const availableTypes = defaultValues
    ? TRANSACTION_TYPES.filter((t) => t !== "transfer")
    : TRANSACTION_TYPES;
  const wasUncategorized = !defaultValues?.category_id;

  // The rule engine couldn't place this transaction, so the user is picking
  // a category by hand — before saving, offer to remember it as a rule
  // (exact merchant match) and preview which other uncategorized
  // transactions would be swept up by it, rather than silently applying it.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!wasUncategorized) return;
    const formData = new FormData(e.currentTarget);
    const categoryId = (formData.get("category_id") as string) ?? "";
    const merchant = ((formData.get("merchant") as string) ?? "").trim();
    if (!categoryId || !merchant) return;

    e.preventDefault();
    setIsCheckingRule(true);
    const matches = await findUncategorizedByMerchant(merchant, transactionId);
    setIsCheckingRule(false);

    if (matches.length === 0) {
      await learnCategorizationRule({
        merchant,
        category_id: categoryId,
        subcategory: ((formData.get("subcategory") as string) ?? "").trim() || null,
        applyToTransactionIds: [],
      });
      startTransition(() => formAction(formData));
      return;
    }

    setRulePreview({
      formData,
      matches,
      merchant,
      categoryId,
      categoryName: categories.find((c) => c.id === categoryId)?.name ?? "this category",
      subcategory: ((formData.get("subcategory") as string) ?? "").trim() || null,
    });
  }

  async function applyToAllAndSave() {
    if (!rulePreview) return;
    setIsApplying(true);
    try {
      await learnCategorizationRule({
        merchant: rulePreview.merchant,
        category_id: rulePreview.categoryId,
        subcategory: rulePreview.subcategory,
        applyToTransactionIds: rulePreview.matches.map((m) => m.id),
      });
      startTransition(() => formAction(rulePreview.formData));
      setRulePreview(null);
    } finally {
      // Harmless if this branch already unmounted via setRulePreview(null)
      // above; needed to re-enable the buttons if learnCategorizationRule
      // threw before reaching that point.
      setIsApplying(false);
    }
  }

  function saveJustThisOne() {
    if (!rulePreview) return;
    startTransition(() => formAction(rulePreview.formData));
    setRulePreview(null);
  }

  if (rulePreview) {
    return (
      <>
      <div className="relative flex flex-col gap-4">
        <p className="text-body text-foreground">
          {rulePreview.matches.length} other uncategorized transaction
          {rulePreview.matches.length === 1 ? "" : "s"} from{" "}
          <strong>{rulePreview.merchant}</strong> can be categorized as{" "}
          <strong>{rulePreview.categoryName}</strong> too, and future imports from this merchant
          will auto-categorize the same way.
        </p>
        <div className="flex flex-col divide-y divide-border bg-surface rounded-xl max-h-64 overflow-y-auto">
          {rulePreview.matches.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-2 text-small">
              <span className="text-foreground">
                {t.date} · {t.description}
              </span>
              <span className="text-muted">{formatCurrency(t.amount)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={applyToAllAndSave} disabled={isPending || isApplying}>
            Apply to all {rulePreview.matches.length} & save
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={saveJustThisOne}
            disabled={isPending || isApplying}
          >
            Just this transaction
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setRulePreview(null)}
            disabled={isPending || isApplying}
          >
            Cancel
          </Button>
        </div>
        <LoadingOverlay show={isPending || isApplying} />
      </div>
      <UnsavedChangesDialog open={isConfirmOpen} onConfirm={confirmLeave} onCancel={cancelLeave} />
      </>
    );
  }

  return (
    <>
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-4"
    >
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
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className={inputClasses}
            >
              <option value="">Auto-detect (rule-based)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* Only for an expense: a refund or income row doesn't consume a
                budget, so the figure would be misleading beside one. */}
            {type === "expense" && selectedBudget && (
              <p
                className={cn(
                  "mt-1 text-small",
                  selectedBudget.remaining < 0 ? "font-medium text-red" : "text-muted",
                )}
              >
                {selectedBudget.remaining < 0
                  ? `${formatCurrency(-selectedBudget.remaining)} over this month's budget`
                  : `${formatCurrency(selectedBudget.remaining)} left this month`}
              </p>
            )}
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

      <Button type="submit" disabled={isPending || isCheckingRule}>
        {isCheckingRule ? "Checking…" : isPending ? "Saving…" : submitLabel}
      </Button>
      <LoadingOverlay show={isPending || isCheckingRule} />
    </form>
    <UnsavedChangesDialog open={isConfirmOpen} onConfirm={confirmLeave} onCancel={cancelLeave} />
    </>
  );
}
