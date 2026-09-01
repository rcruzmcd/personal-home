// Mirrors categorization_rules in
// supabase/migrations/20260831000000_initial_schema.sql. Pure matching
// logic lives here (not in the server action) so it's testable without a
// database — callers fetch the active rules and pass them in.

export type MatchField = "merchant" | "description";
export type MatchOperator = "contains" | "equals";

export type CategorizationRule = {
  match_field: MatchField;
  match_operator: MatchOperator;
  match_value: string;
  category_id: string;
  subcategory: string | null;
  priority: number;
  active: boolean;
};

export type CategorizableTransaction = {
  merchant: string | null;
  description: string;
};

export type CategorizationMatch = {
  category_id: string;
  subcategory: string | null;
};

/**
 * Returns the category/subcategory from the highest-priority active rule
 * that matches, or null if no rule matches (docs/PERSONAL_FINANCE_REQUIREMENTS.md
 * §4: "Priority (if multiple rules match)" — higher `priority` wins).
 * Callers should only reach for this when the user hasn't manually picked
 * a category; a manual pick always overrides the rule engine.
 */
export function matchCategorizationRule(
  transaction: CategorizableTransaction,
  rules: readonly CategorizationRule[],
): CategorizationMatch | null {
  let best: CategorizationRule | null = null;
  for (const rule of rules) {
    if (!rule.active) continue;
    if (!ruleMatches(rule, transaction)) continue;
    if (!best || rule.priority > best.priority) best = rule;
  }
  return best ? { category_id: best.category_id, subcategory: best.subcategory } : null;
}

function ruleMatches(rule: CategorizationRule, transaction: CategorizableTransaction): boolean {
  const field = rule.match_field === "merchant" ? transaction.merchant : transaction.description;
  if (!field) return false;
  const value = field.trim().toLowerCase();
  const target = rule.match_value.trim().toLowerCase();
  return rule.match_operator === "contains" ? value.includes(target) : value === target;
}
