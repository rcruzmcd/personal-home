import { describe, expect, test } from "vitest";
import { matchCategorizationRule, type CategorizationRule } from "../rules";

function rule(overrides: Partial<CategorizationRule>): CategorizationRule {
  return {
    match_field: "merchant",
    match_operator: "contains",
    match_value: "",
    category_id: "cat-1",
    subcategory: null,
    priority: 0,
    active: true,
    ...overrides,
  };
}

describe("matchCategorizationRule", () => {
  test("matches on merchant contains, case-insensitively", () => {
    const rules = [
      rule({ match_value: "UBER", category_id: "transport", subcategory: "Rideshare" }),
    ];
    const result = matchCategorizationRule(
      { merchant: "Uber Eats", description: "UBER   *EATS" },
      rules,
    );
    expect(result).toEqual({ category_id: "transport", subcategory: "Rideshare" });
  });

  test("matches on description equals", () => {
    const rules = [
      rule({
        match_field: "description",
        match_operator: "equals",
        match_value: "netflix",
        category_id: "entertainment",
        subcategory: "Streaming",
      }),
    ];
    expect(
      matchCategorizationRule({ merchant: null, description: "Netflix" }, rules),
    ).toEqual({ category_id: "entertainment", subcategory: "Streaming" });
    expect(
      matchCategorizationRule({ merchant: null, description: "Netflix Extra" }, rules),
    ).toBeNull();
  });

  test("higher priority wins when multiple rules match", () => {
    const rules = [
      rule({ match_value: "WHOLE FOODS", category_id: "food", priority: 0 }),
      rule({ match_value: "WHOLE", category_id: "shopping", priority: 5 }),
    ];
    const result = matchCategorizationRule(
      { merchant: "WHOLE FOODS MKT", description: "" },
      rules,
    );
    expect(result?.category_id).toBe("shopping");
  });

  test("ignores inactive rules", () => {
    const rules = [rule({ match_value: "LYFT", active: false, category_id: "transport" })];
    expect(matchCategorizationRule({ merchant: "LYFT", description: "" }, rules)).toBeNull();
  });

  test("returns null when nothing matches", () => {
    const rules = [rule({ match_value: "NETFLIX" })];
    expect(
      matchCategorizationRule({ merchant: "Spotify", description: "Spotify" }, rules),
    ).toBeNull();
  });

  test("a rule on merchant does not fall back to description", () => {
    const rules = [rule({ match_field: "merchant", match_value: "UBER" })];
    expect(
      matchCategorizationRule({ merchant: null, description: "UBER ride" }, rules),
    ).toBeNull();
  });
});
