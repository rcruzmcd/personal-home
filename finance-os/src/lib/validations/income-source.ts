import { z } from "zod";

export const INCOME_FREQUENCIES = ["monthly", "weekly", "one_time"] as const;
export const CONFIDENCE_LEVELS = ["certain", "likely", "possible"] as const;
export const TAX_TREATMENTS = ["taxable", "non_taxable"] as const;

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const incomeSourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  frequency: z.enum(INCOME_FREQUENCIES),
  start_date: z.preprocess(emptyToUndefined, z.string().optional()),
  end_date: z.preprocess(emptyToUndefined, z.string().optional()),
  expected_date: z.preprocess(emptyToUndefined, z.string().optional()),
  confidence: z.enum(CONFIDENCE_LEVELS),
  tax_treatment: z.enum(TAX_TREATMENTS),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type IncomeSourceInput = z.infer<typeof incomeSourceSchema>;
