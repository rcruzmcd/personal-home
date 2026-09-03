import { z } from "zod";

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

// Recording a closed statement (statements table). closing_date is submitted
// as a hidden field rather than typed: it is derived from accounts.statement_day
// by src/lib/calculations/statements.ts, so the user is confirming a cycle the
// app identified, not picking a date.
export const statementSchema = z.object({
  closing_date: z.string().min(1, "Closing date is required"),
  due_date: z.string().min(1, "Due date is required"),
  statement_balance: z.coerce.number(),
  minimum_payment: z.coerce.number().min(0, "Minimum payment cannot be negative"),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type StatementInput = z.infer<typeof statementSchema>;
