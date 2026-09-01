// Mirrors the "Essential" category list in
// docs/PERSONAL_FINANCE_REQUIREMENTS.md §4. Categories aren't schema-enum
// constrained (categories.name is free text), so essential-ness is decided
// by name match rather than a stored flag — callers can override the list
// entirely via calculateCashRunway's `essentialCategories` option.
export const DEFAULT_ESSENTIAL_CATEGORIES = [
  "Housing",
  "Food",
  "Transportation",
  "Insurance",
  "Healthcare",
  "Phone/Internet",
  "Childcare",
] as const;

export function isEssentialCategory(
  categoryName: string | null,
  essentialCategories: readonly string[] = DEFAULT_ESSENTIAL_CATEGORIES,
): boolean {
  if (!categoryName) return false;
  return essentialCategories.some(
    (name) => name.toLowerCase() === categoryName.toLowerCase(),
  );
}
