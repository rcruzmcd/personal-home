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

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  institution: z.preprocess(emptyToUndefined, z.string().optional()),
  type: z.enum(ACCOUNT_TYPES),
  subtype: z.preprocess(emptyToUndefined, z.string().optional()),
  balance: z.coerce.number(),
  credit_limit: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  interest_rate: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  minimum_payment: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
  due_date: z.preprocess(emptyToUndefined, z.string().optional()),
  statement_date: z.preprocess(emptyToUndefined, z.string().optional()),
  opening_date: z.preprocess(emptyToUndefined, z.string().optional()),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type AccountInput = z.infer<typeof accountSchema>;
