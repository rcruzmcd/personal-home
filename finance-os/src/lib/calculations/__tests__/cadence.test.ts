import { describe, expect, test } from "vitest";
import { inferFrequency, median, normalizeMerchant } from "../cadence";

describe("normalizeMerchant", () => {
  test("lowercases and trims", () => {
    expect(normalizeMerchant("  Netflix.com  ")).toBe("netflix.com");
  });

  test("strips a Square processor prefix", () => {
    expect(normalizeMerchant("SQ *COFFEE SHOP")).toBe("coffee shop");
  });

  test("strips a trailing store number", () => {
    expect(normalizeMerchant("Whole Foods 4521")).toBe("whole foods");
  });

  test("collapses internal whitespace", () => {
    expect(normalizeMerchant("UBER   *EATS")).toBe("uber");
  });
});

describe("median", () => {
  test("averages the two middle values for an even-length list", () => {
    expect(median([1, 3, 5, 7])).toBe(4);
  });

  test("returns the middle value for an odd-length list", () => {
    expect(median([5, 1, 3])).toBe(3);
  });
});

describe("inferFrequency", () => {
  test("infers monthly from ~30 day gaps", () => {
    expect(inferFrequency(["2026-06-01", "2026-07-01", "2026-08-01"])).toBe("monthly");
  });

  test("infers weekly from ~7 day gaps", () => {
    expect(inferFrequency(["2026-08-01", "2026-08-08", "2026-08-15", "2026-08-22"])).toBe(
      "weekly",
    );
  });

  test("infers annually from ~365 day gaps", () => {
    expect(inferFrequency(["2024-01-01", "2025-01-01", "2026-01-01"])).toBe("annually");
  });

  test("returns null for fewer than three dates", () => {
    expect(inferFrequency(["2026-08-01", "2026-08-08"])).toBeNull();
  });

  test("returns null for irregular gaps", () => {
    expect(inferFrequency(["2026-06-01", "2026-06-05", "2026-08-20"])).toBeNull();
  });
});
