import { z } from "zod";

export const statementEntrySchema = z.object({
  entered_through: z.string().min(1, "Date is required"),
});

export type StatementEntryInput = z.infer<typeof statementEntrySchema>;
