import { describe, expect, it } from "vitest";
import { compareChoice, compareResultSets } from "@/lib/domain/grading";

describe("compareResultSets", () => {
  it("passes when rows match regardless of order by default", () => {
    const actual = [{ a: 1 }, { a: 2 }];
    const expected = [{ a: 2 }, { a: 1 }];
    expect(compareResultSets(actual, expected).passed).toBe(true);
  });

  it("fails when row counts differ", () => {
    const result = compareResultSets([{ a: 1 }], [{ a: 1 }, { a: 2 }]);
    expect(result.passed).toBe(false);
    expect(result.reason).toMatch(/行数/);
  });

  it("respects orderMatters", () => {
    const actual = [{ a: 1 }, { a: 2 }];
    const expected = [{ a: 2 }, { a: 1 }];
    expect(compareResultSets(actual, expected, { orderMatters: true }).passed).toBe(false);
  });

  it("normalizes bigint and number types the same way", () => {
    const actual = [{ count: BigInt(3) }];
    const expected = [{ count: 3 }];
    expect(compareResultSets(actual, expected).passed).toBe(true);
  });
});

describe("compareChoice", () => {
  it("passes for a correct option", () => {
    expect(compareChoice("c", ["c"]).passed).toBe(true);
  });

  it("fails for an incorrect option", () => {
    expect(compareChoice("a", ["c"]).passed).toBe(false);
  });
});
