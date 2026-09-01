import { z } from "zod";

export const RECURRING_FREQUENCIES = ["daily", "weekly", "monthly", "annually"] as const;

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const recurringExpenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  merchant: z.preprocess(emptyToUndefined, z.string().optional()),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  frequency: z.enum(RECURRING_FREQUENCIES),
  next_date: z.preprocess(emptyToUndefined, z.string().optional()),
  category_id: z.preprocess(emptyToUndefined, z.uuid().optional()),
  account_id: z.preprocess(emptyToUndefined, z.uuid().optional()),
  active: z.preprocess((val) => val === "on" || val === "true", z.boolean()),
});

export type RecurringExpenseInput = z.infer<typeof recurringExpenseSchema>;
