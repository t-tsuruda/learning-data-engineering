import { describe, expect, it } from "vitest";
import { createInitialAchievementStats, evaluateAchievements } from "@/lib/domain/achievements";

describe("evaluateAchievements", () => {
  it("unlocks nothing for a fresh user", () => {
    expect(evaluateAchievements(createInitialAchievementStats())).toEqual([]);
  });

  it("unlocks first-step after the first cleared quest", () => {
    const stats = { ...createInitialAchievementStats(), totalQuestsCleared: 1 };
    expect(evaluateAchievements(stats)).toContain("first-step");
  });

  it("unlocks detective after 3 no-hint investigations", () => {
    const stats = { ...createInitialAchievementStats(), investigationCluesFoundNoHint: 3, totalQuestsCleared: 3 };
    expect(evaluateAchievements(stats)).toContain("detective");
  });

  it("does not unlock debugger before 5 pipeline clears", () => {
    const stats = { ...createInitialAchievementStats(), pipelineQuestsCleared: 4, totalQuestsCleared: 4 };
    expect(evaluateAchievements(stats)).not.toContain("debugger");
  });
});
