import { z } from "zod";
import { MATCH_FIELDS, MATCH_OPERATORS } from "@/lib/categorization/rules";

const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const categorizationRuleSchema = z.object({
  match_field: z.enum(MATCH_FIELDS),
  match_operator: z.enum(MATCH_OPERATORS),
  match_value: z.string().min(1, "Match value is required"),
  category_id: z.uuid(),
  subcategory: z.preprocess(emptyToUndefined, z.string().optional()),
  priority: z.coerce.number().int(),
  active: z.preprocess((val) => val === "on" || val === "true", z.boolean()),
});

export type CategorizationRuleInput = z.infer<typeof categorizationRuleSchema>;
