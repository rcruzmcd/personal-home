import { describe, expect, it } from "vitest";
import { findHeaderRowIndex } from "../parse-file";

describe("findHeaderRowIndex", () => {
  it("returns 0 when the first row is already the header", () => {
    const rows = [
      ["Date", "Description", "Amount", "Category"],
      ["2026-01-01", "Coffee", "-5.00", "Food"],
    ];
    expect(findHeaderRowIndex(rows)).toBe(0);
  });

  it("skips a bank summary preamble to find the real header row", () => {
    const rows = [
      ["Description", "", "Summary Amt."],
      ["Beginning balance as of 02/26/2026", "", "2,092.32"],
      ["Total credits", "", "10,468.55"],
      ["Total debits", "", "-7,676.52"],
      ["Ending balance as of 03/27/2026", "", "4,884.35"],
      ["Date", "Description", "Amount", "Running Bal."],
      ["02/26/2026", "Beginning balance as of 02/26/2026", "", "2,092.32"],
      ["02/27/2026", "ADP TECH SVC RKH DES:PAYROLL", "3,489.52", "5,581.84"],
    ];
    expect(findHeaderRowIndex(rows)).toBe(5);
  });

  it("falls back to 0 when no row looks like a header", () => {
    const rows = [
      ["foo", "bar"],
      ["1", "2"],
    ];
    expect(findHeaderRowIndex(rows)).toBe(0);
  });
});
