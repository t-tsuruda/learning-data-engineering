import { describe, expect, it } from "vitest";
import { calculateQuestXp } from "@/lib/domain/xp";

describe("calculateQuestXp", () => {
  it("gives base XP only when nothing else applies", () => {
    const result = calculateQuestXp({
      baseXp: 100,
      firstAttemptClear: false,
      goodInvestigation: false,
      hintsUsed: 0,
      explainedWhy: false,
      isReviewSuccess: false,
    });
    expect(result.total).toBe(100);
  });

  it("rewards first-attempt no-hint clears with a bonus", () => {
    const result = calculateQuestXp({
      baseXp: 100,
      firstAttemptClear: true,
      goodInvestigation: false,
      hintsUsed: 0,
      explainedWhy: false,
      isReviewSuccess: false,
    });
    expect(result.firstAttempt).toBe(50);
    expect(result.total).toBe(150);
  });

  it("does not penalize hint usage, only adds a small bonus", () => {
    const result = calculateQuestXp({
      baseXp: 100,
      firstAttemptClear: false,
      goodInvestigation: false,
      hintsUsed: 2,
      explainedWhy: false,
      isReviewSuccess: false,
    });
    expect(result.hintUsed).toBe(10);
    expect(result.total).toBe(110);
  });

  it("stacks all bonuses for a fully engaged boss clear", () => {
    const result = calculateQuestXp({
      baseXp: 500,
      firstAttemptClear: true,
      goodInvestigation: true,
      hintsUsed: 0,
      explainedWhy: true,
      isReviewSuccess: false,
    });
    expect(result.total).toBe(500 + 50 + 30 + 40);
  });
});
