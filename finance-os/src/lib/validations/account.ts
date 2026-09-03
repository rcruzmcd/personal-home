import { z } from "zod";

export const ACCOUNT_TYPES = [
  "checking",
  "savings",
  "cash",
  "credit_card",
  "personal_loan",
  "auto_loan",
  "student_loan",
  "mortgage",
  "brokerage",
  "retirement",
  "other_asset",
  "other_liability",
] as const;

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

// Clearing a day field has to write an explicit null: `undefined` is dropped
// from the update payload, so the old value would silently stick.
const emptyToNull = (val: unknown) => (val === "" || val === undefined ? null : val);

/**
 * A day-of-month field (accounts.due_day / accounts.statement_day). The range
 * mirrors the accounts_*_day_range check constraints, so a bad value is caught
 * as a form message rather than a Postgres error.
 */
const dayOfMonth = (label: string) =>
  z.preprocess(
    emptyToNull,
    z.coerce
      .number()
      .int(`${label} must be a whole number`)
      .min(1, `${label} must be between 1 and 31`)
      .max(31, `${label} must be between 1 and 31`)
      .nullable(),
  );

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  institution: z.preprocess(emptyToUndefined, z.string().optional()),
  type: z.enum(ACCOUNT_TYPES),
  subtype: z.preprocess(emptyToUndefined, z.string().optional()),
  balance: z.coerce.number(),
  credit_limit: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  interest_rate: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  minimum_payment: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  due_day: dayOfMonth("Due day"),
  statement_day: dayOfMonth("Statement day"),
  opening_date: z.preprocess(emptyToUndefined, z.string().optional()),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type AccountInput = z.infer<typeof accountSchema>;
