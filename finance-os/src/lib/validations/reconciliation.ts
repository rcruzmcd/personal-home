import { z } from "zod";

export const RECONCILIATION_EXPLANATIONS = [
  "pending_transaction",
  "rounding",
  "input_error",
  "other",
] as const;

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const reconciliationSchema = z.object({
  bank_balance: z.coerce.number(),
  explanation: z.preprocess(emptyToUndefined, z.enum(RECONCILIATION_EXPLANATIONS).optional()),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type ReconciliationInput = z.infer<typeof reconciliationSchema>;
