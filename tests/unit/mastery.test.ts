import { describe, expect, it } from "vitest";
import { createInitialUserSkillStats, updateMastery } from "@/lib/domain/mastery";

describe("updateMastery", () => {
  it("never penalizes a failed-but-attempted quest", () => {
    const initial = createInitialUserSkillStats();
    const next = updateMastery(initial, {
      cleared: false,
      firstAttempt: false,
      hintsUsed: 0,
      isRetrySuccess: false,
      isReviewSuccess: false,
      explainedWhy: false,
    });
    expect(next.masteryScore).toBeGreaterThanOrEqual(initial.masteryScore);
  });

  it("rewards first-try no-hint clears more than hint-assisted clears", () => {
    const base = createInitialUserSkillStats();
    const firstTry = updateMastery(base, {
      cleared: true,
      firstAttempt: true,
      hintsUsed: 0,
      isRetrySuccess: false,
      isReviewSuccess: false,
      explainedWhy: false,
    });
    const withHint = updateMastery(base, {
      cleared: true,
      firstAttempt: false,
      hintsUsed: 2,
      isRetrySuccess: false,
      isReviewSuccess: false,
      explainedWhy: false,
    });
    expect(firstTry.masteryScore).toBeGreaterThan(withHint.masteryScore);
  });

  it("clamps mastery score to [0, 100]", () => {
    let stats = createInitialUserSkillStats();
    for (let i = 0; i < 50; i++) {
      stats = updateMastery(stats, {
        cleared: true,
        firstAttempt: true,
        hintsUsed: 0,
        isRetrySuccess: false,
        isReviewSuccess: false,
        explainedWhy: true,
      });
    }
    expect(stats.masteryScore).toBeLessThanOrEqual(100);
  });

  it("weighs spaced-review success the highest", () => {
    const base = createInitialUserSkillStats();
    const review = updateMastery(base, {
      cleared: true,
      firstAttempt: false,
      hintsUsed: 0,
      isRetrySuccess: false,
      isReviewSuccess: true,
      explainedWhy: false,
    });
    const normal = updateMastery(base, {
      cleared: true,
      firstAttempt: true,
      hintsUsed: 0,
      isRetrySuccess: false,
      isReviewSuccess: false,
      explainedWhy: false,
    });
    expect(review.masteryScore).toBeGreaterThan(normal.masteryScore);
  });
});
