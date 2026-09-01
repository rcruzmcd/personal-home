import { describe, expect, test } from "vitest";
import { isEssentialCategory } from "../categories";

describe("isEssentialCategory", () => {
  test("matches default essential categories case-insensitively", () => {
    expect(isEssentialCategory("housing")).toBe(true);
    expect(isEssentialCategory("HOUSING")).toBe(true);
  });

  test("null category is never essential", () => {
    expect(isEssentialCategory(null)).toBe(false);
  });

  test("discretionary categories are not essential", () => {
    expect(isEssentialCategory("Entertainment")).toBe(false);
  });

  test("respects a custom essential list", () => {
    expect(isEssentialCategory("Gym", ["Gym"])).toBe(true);
    expect(isEssentialCategory("Housing", ["Gym"])).toBe(false);
  });
});
