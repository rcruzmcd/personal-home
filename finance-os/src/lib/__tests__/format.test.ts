import { describe, expect, test } from "vitest";
import { formatDayOfMonth } from "../format";

describe("formatDayOfMonth", () => {
  test("uses the right suffix for the low days", () => {
    expect(formatDayOfMonth(1)).toBe("1st");
    expect(formatDayOfMonth(2)).toBe("2nd");
    expect(formatDayOfMonth(3)).toBe("3rd");
    expect(formatDayOfMonth(4)).toBe("4th");
  });

  test("handles the 11-13 exception", () => {
    expect(formatDayOfMonth(11)).toBe("11th");
    expect(formatDayOfMonth(12)).toBe("12th");
    expect(formatDayOfMonth(13)).toBe("13th");
  });

  test("resumes the normal pattern in the twenties and thirties", () => {
    expect(formatDayOfMonth(21)).toBe("21st");
    expect(formatDayOfMonth(22)).toBe("22nd");
    expect(formatDayOfMonth(23)).toBe("23rd");
    expect(formatDayOfMonth(30)).toBe("30th");
    expect(formatDayOfMonth(31)).toBe("31st");
  });
});
