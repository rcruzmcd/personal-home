import { describe, expect, test } from "vitest";
import {
  BUDGET_NEAR_LIMIT_RATIO,
  budgetLimitsByCategoryName,
  buildBudgetSummary,
  detectBudgetAlerts,
  monthProgress,
} from "../budgets";
import type { CalcBudget, CategorySpend } from "../types";

const FOOD = "11111111-1111-1111-1111-111111111111";
const DINING = "22222222-2222-2222-2222-222222222222";
const FITNESS = "33333333-3333-3333-3333-333333333333";

const CATEGORIES = [
  { id: FOOD, name: "Food" },
  { id: DINING, name: "Dining Out" },
  { id: FITNESS, name: "Fitness" },
];

function budget(overrides: Partial<CalcBudget> = {}): CalcBudget {
  return { categoryId: FOOD, categoryName: "Food", amount: 600, ...overrides };
}

function summary(input: {
  budgets?: readonly CalcBudget[];
  spendByCategory?: readonly CategorySpend[];
  categories?: readonly { id: string; name: string }[];
  month?: Date;
  asOfDate?: Date;
}) {
  return buildBudgetSummary({
    budgets: input.budgets ?? [],
    categories: input.categories ?? CATEGORIES,
    spendByCategory: input.spendByCategory ?? [],
    month: input.month ?? new Date(2026, 8, 15),
    asOfDate: input.asOfDate ?? new Date(2026, 8, 15),
  });
}

describe("buildBudgetSummary", () => {
  test("empty input totals zero", () => {
    const result = summary({ categories: [] });
    expect(result.lines).toEqual([]);
    expect(result.totalBudgeted).toBe(0);
    expect(result.totalSpent).toBe(0);
    expect(result.unbudgetedSpend).toBe(0);
  });

  test("classifies under, near and over against the limit", () => {
    const result = summary({
      budgets: [
        budget({ categoryId: FOOD, categoryName: "Food", amount: 600 }),
        budget({ categoryId: DINING, categoryName: "Dining Out", amount: 250 }),
        budget({ categoryId: FITNESS, categoryName: "Fitness", amount: 100 }),
      ],
      spendByCategory: [
        { categoryId: FOOD, spent: 300 }, // 50%
        { categoryId: DINING, spent: 310 }, // 124%
        { categoryId: FITNESS, spent: 85 }, // 85%
      ],
    });

    const byName = Object.fromEntries(result.lines.map((l) => [l.categoryName, l]));
    expect(byName.Food.status).toBe("under");
    expect(byName["Dining Out"].status).toBe("over");
    expect(byName.Fitness.status).toBe("near");
  });

  test("ratio is not clamped, so an over-budget category reads above 100%", () => {
    const result = summary({
      budgets: [budget({ amount: 250 })],
      categories: [{ id: FOOD, name: "Food" }],
      spendByCategory: [{ categoryId: FOOD, spent: 325 }],
    });
    expect(result.lines[0].ratio).toBeCloseTo(1.3);
    expect(result.lines[0].remaining).toBe(-75);
  });

  test("spending exactly the limit reads as near, not under", () => {
    const result = summary({
      budgets: [budget({ amount: 600 })],
      categories: [{ id: FOOD, name: "Food" }],
      spendByCategory: [{ categoryId: FOOD, spent: 600 }],
    });
    expect(result.lines[0].status).toBe("near");
    expect(result.lines[0].remaining).toBe(0);
  });

  test("the near-limit boundary is inclusive", () => {
    const result = summary({
      budgets: [budget({ amount: 100 })],
      categories: [{ id: FOOD, name: "Food" }],
      spendByCategory: [{ categoryId: FOOD, spent: 100 * BUDGET_NEAR_LIMIT_RATIO }],
    });
    expect(result.lines[0].status).toBe("near");
  });

  test("a budgeted category with no spend is under, not missing", () => {
    const result = summary({
      budgets: [budget({ amount: 600 })],
      categories: [{ id: FOOD, name: "Food" }],
    });
    expect(result.lines[0].spent).toBe(0);
    expect(result.lines[0].remaining).toBe(600);
    expect(result.lines[0].status).toBe("under");
  });

  test("unbudgeted categories still get a line, and their spend is kept separate", () => {
    const result = summary({
      budgets: [budget({ categoryId: FOOD, amount: 600 })],
      spendByCategory: [
        { categoryId: FOOD, spent: 200 },
        { categoryId: DINING, spent: 90 },
      ],
    });

    const dining = result.lines.find((l) => l.categoryId === DINING)!;
    expect(dining.status).toBe("unbudgeted");
    expect(dining.limit).toBeNull();
    expect(dining.spent).toBe(90);

    expect(result.totalSpent).toBe(200); // budgeted categories only
    expect(result.unbudgetedSpend).toBe(90);
    expect(result.totalRemaining).toBe(400);
    expect(result.budgetedCount).toBe(1);
  });

  test("uncategorized spend counts as unbudgeted rather than vanishing", () => {
    const result = summary({
      budgets: [budget({ amount: 600 })],
      categories: [{ id: FOOD, name: "Food" }],
      spendByCategory: [
        { categoryId: FOOD, spent: 100 },
        { categoryId: null, spent: 45 },
      ],
    });
    expect(result.unbudgetedSpend).toBe(45);
    expect(result.totalSpent).toBe(100);
  });

  test("spend in a category that no longer exists is still reported", () => {
    const result = summary({
      categories: [{ id: FOOD, name: "Food" }],
      spendByCategory: [{ categoryId: "deleted-category", spent: 60 }],
    });
    expect(result.unbudgetedSpend).toBe(60);
  });

  test("a budget whose category is gone contributes no line", () => {
    const result = summary({
      budgets: [budget({ categoryId: "deleted-category", amount: 500 })],
      categories: [{ id: FOOD, name: "Food" }],
    });
    expect(result.lines).toHaveLength(1);
    expect(result.totalBudgeted).toBe(0);
  });

  test("attention lists over before near, each by ratio descending", () => {
    const result = summary({
      budgets: [
        budget({ categoryId: FOOD, categoryName: "Food", amount: 100 }),
        budget({ categoryId: DINING, categoryName: "Dining Out", amount: 100 }),
        budget({ categoryId: FITNESS, categoryName: "Fitness", amount: 100 }),
      ],
      spendByCategory: [
        { categoryId: FOOD, spent: 85 }, // near
        { categoryId: DINING, spent: 110 }, // over, 1.1
        { categoryId: FITNESS, spent: 150 }, // over, 1.5
      ],
    });
    expect(result.attention.map((l) => l.categoryName)).toEqual([
      "Fitness",
      "Dining Out",
      "Food",
    ]);
    expect(result.overCount).toBe(2);
    expect(result.nearCount).toBe(1);
  });

  test("totals go negative when the plan as a whole is blown", () => {
    const result = summary({
      budgets: [budget({ amount: 100 })],
      categories: [{ id: FOOD, name: "Food" }],
      spendByCategory: [{ categoryId: FOOD, spent: 175 }],
    });
    expect(result.totalRemaining).toBe(-75);
  });
});

describe("monthProgress", () => {
  test("a month wholly in the past is complete", () => {
    expect(monthProgress(new Date(2026, 7, 15), new Date(2026, 8, 10))).toBe(1);
  });

  test("a month wholly in the future has not started", () => {
    expect(monthProgress(new Date(2026, 9, 15), new Date(2026, 8, 10))).toBe(0);
  });

  test("mid-month is the fraction of days elapsed", () => {
    // 15th of a 30-day month: 15 of 30 days have begun.
    expect(monthProgress(new Date(2026, 8, 14), new Date(2026, 8, 14))).toBeCloseTo(15 / 30);
  });

  test("the last day of the month is complete", () => {
    expect(monthProgress(new Date(2026, 8, 1), new Date(2026, 8, 30))).toBe(1);
  });
});

describe("detectBudgetAlerts", () => {
  test("no budgets raises nothing", () => {
    expect(detectBudgetAlerts(summary({}))).toEqual([]);
  });

  test("raises over before near and ignores healthy categories", () => {
    const alerts = detectBudgetAlerts(
      summary({
        budgets: [
          budget({ categoryId: FOOD, categoryName: "Food", amount: 100 }),
          budget({ categoryId: DINING, categoryName: "Dining Out", amount: 100 }),
          budget({ categoryId: FITNESS, categoryName: "Fitness", amount: 100 }),
        ],
        spendByCategory: [
          { categoryId: FOOD, spent: 10 }, // under — no alert
          { categoryId: DINING, spent: 85 }, // near
          { categoryId: FITNESS, spent: 130 }, // over
        ],
      }),
    );

    expect(alerts).toHaveLength(2);
    expect(alerts[0].kind).toBe("over");
    expect(alerts[0].line.categoryName).toBe("Fitness");
    expect(alerts[1].kind).toBe("near");
  });
});

describe("budgetLimitsByCategoryName", () => {
  test("keys by lowercased name", () => {
    expect(
      budgetLimitsByCategoryName([
        budget({ categoryName: "Dining Out", amount: 250 }),
        budget({ categoryName: "Food", amount: 600 }),
      ]),
    ).toEqual({ "dining out": 250, food: 600 });
  });

  test("skips a budget with no category name", () => {
    expect(budgetLimitsByCategoryName([budget({ categoryName: null })])).toEqual({});
  });

  test("empty input yields no limits", () => {
    expect(budgetLimitsByCategoryName([])).toEqual({});
  });
});
