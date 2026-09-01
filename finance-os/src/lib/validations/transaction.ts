import { z } from "zod";

export const TRANSACTION_TYPES = [
  "expense",
  "income",
  "transfer",
  "refund",
  "adjustment",
] as const;

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const transactionSchema = z
  .object({
    account_id: z.uuid(),
    to_account_id: z.preprocess(emptyToUndefined, z.uuid().optional()),
    date: z.string().min(1, "Date is required"),
    description: z.string().min(1, "Description is required"),
    merchant: z.preprocess(emptyToUndefined, z.string().optional()),
    amount: z.coerce.number().refine((n) => n !== 0, "Amount can't be zero"),
    type: z.enum(TRANSACTION_TYPES),
    // Empty means "let the rule engine decide" — a non-empty value is a
    // manual override and always wins (docs/PERSONAL_FINANCE_REQUIREMENTS.md
    // §4, "Fallback: User can manually override categorization").
    category_id: z.preprocess(emptyToUndefined, z.uuid().optional()),
    subcategory: z.preprocess(emptyToUndefined, z.string().optional()),
  })
  .superRefine((data, ctx) => {
    if (data.type === "transfer") {
      if (!data.to_account_id) {
        ctx.addIssue({
          code: "custom",
          message: "Select a destination account for the transfer.",
          path: ["to_account_id"],
        });
      } else if (data.to_account_id === data.account_id) {
        ctx.addIssue({
          code: "custom",
          message: "Pick two different accounts for a transfer.",
          path: ["to_account_id"],
        });
      }
    }
  });

export type TransactionInput = z.infer<typeof transactionSchema>;

// Expense/adjustment-out convention: negative = money out, positive = money
// in. The user types a magnitude; we infer sign from type so they never have
// to remember to type a minus sign for an expense. "adjustment" keeps
// whatever sign the user entered since a correction can go either way.
export function normalizeAmount(type: TransactionInput["type"], amount: number) {
  switch (type) {
    case "expense":
      return -Math.abs(amount);
    case "income":
    case "refund":
      return Math.abs(amount);
    default:
      return amount;
  }
}
