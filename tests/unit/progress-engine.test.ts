import { describe, expect, it } from "vitest";
import { applyQuestCompletion, createInitialProgressState } from "@/lib/domain/progress-engine";

const now = new Date("2026-08-27T05:00:00Z"); // 14:00 JST

describe("applyQuestCompletion", () => {
  it("awards XP, updates mastery, and unlocks first-step on the first clear", () => {
    const state = createInitialProgressState();
    const result = applyQuestCompletion(state, {
      questId: "quest-001",
      questCategory: "data-investigation",
      skillIds: ["sql-select"],
      baseXp: 100,
      cleared: true,
      attemptCount: 1,
      hintsUsed: 0,
      goodInvestigation: true,
      explainedWhy: true,
      isRetrySuccess: false,
      isReviewSuccess: false,
      now,
    });

    expect(result.xp?.total).toBeGreaterThan(100);
    expect(result.state.totalXp).toBe(result.xp?.total);
    expect(result.state.skills["sql-select"].masteryScore).toBeGreaterThan(0);
    expect(result.newlyUnlockedAchievementIds).toContain("first-step");
    expect(result.streakUpdate.change).toBe("started");
  });

  it("does not award XP or advance streak on a failed attempt, but still records learning signal", () => {
    const state = createInitialProgressState();
    const result = applyQuestCompletion(state, {
      questId: "quest-001",
      questCategory: "data-investigation",
      skillIds: ["sql-select"],
      baseXp: 100,
      cleared: false,
      attemptCount: 1,
      hintsUsed: 0,
      goodInvestigation: false,
      explainedWhy: false,
      isRetrySuccess: false,
      isReviewSuccess: false,
      now,
    });

    expect(result.xp).toBeUndefined();
    expect(result.state.totalXp).toBe(0);
    expect(result.state.skills["sql-select"].masteryScore).toBeGreaterThan(0);
    expect(result.newlyUnlockedAchievementIds).toEqual([]);
  });

  it("unlocks detective after three no-hint investigation clears", () => {
    let state = createInitialProgressState();
    for (let i = 0; i < 3; i++) {
      const result = applyQuestCompletion(state, {
        questId: `quest-${i}`,
        questCategory: "data-investigation",
        skillIds: ["data-investigation"],
        baseXp: 100,
        cleared: true,
        attemptCount: 1,
        hintsUsed: 0,
        goodInvestigation: true,
        explainedWhy: false,
        isRetrySuccess: false,
        isReviewSuccess: false,
        now: new Date(now.getTime() + i * 24 * 60 * 60 * 1000),
      });
      state = result.state;
    }
    expect(state.unlockedAchievementIds).toContain("detective");
  });
});
