/**
 * Quest完了時の状態更新をまとめて計算する「Progress Engine」。
 * Demo Mode（zustand store）とFull Mode（Server Action）の両方から呼び出せるよう、
 * 副作用を持たない純粋関数として実装する（docs/architecture.md §4.1）。
 */
import {
  type AchievementStats,
  evaluateAchievements,
} from "./achievements";
import { calculateQuestXp, type QuestXpBreakdown } from "./xp";
import { createInitialUserSkillStats, updateMastery, type UserSkillStats } from "./mastery";
import { recordActivity, type StreakState, type StreakUpdateResult } from "./streak";

export interface QuestCompletionInput {
  questId: string;
  questCategory: string;
  skillIds: string[];
  baseXp: number;
  cleared: boolean;
  attemptCount: number;
  hintsUsed: number;
  goodInvestigation: boolean;
  explainedWhy: boolean;
  isRetrySuccess: boolean;
  isReviewSuccess: boolean;
  confidenceBefore?: number;
  confidenceAfter?: number;
  now: Date;
}

export interface QuestCompletionState {
  totalXp: number;
  skills: Record<string, UserSkillStats>;
  streak: StreakState;
  achievementStats: AchievementStats;
  unlockedAchievementIds: string[];
}

export interface QuestCompletionResult {
  xp?: QuestXpBreakdown;
  streakUpdate: StreakUpdateResult;
  newlyUnlockedAchievementIds: string[];
  masteryDeltas: { skillId: string; before: number; after: number }[];
  state: QuestCompletionState;
}

export function createInitialProgressState(): QuestCompletionState {
  return {
    totalXp: 0,
    skills: {},
    streak: { currentStreak: 0, longestStreak: 0, lastActiveDateKey: null },
    achievementStats: {
      investigationCluesFoundNoHint: 0,
      hintLevel1OnlyClears: 0,
      pipelineQuestsCleared: 0,
      dataModelingQuestsCleared: 0,
      totalQuestsCleared: 0,
    },
    unlockedAchievementIds: [],
  };
}

export function applyQuestCompletion(
  state: QuestCompletionState,
  input: QuestCompletionInput,
): QuestCompletionResult {
  const firstAttemptClear = input.cleared && input.attemptCount === 1 && input.hintsUsed === 0;

  let xp: QuestXpBreakdown | undefined;
  let totalXp = state.totalXp;
  if (input.cleared) {
    xp = calculateQuestXp({
      baseXp: input.baseXp,
      firstAttemptClear,
      goodInvestigation: input.goodInvestigation,
      hintsUsed: input.hintsUsed,
      explainedWhy: input.explainedWhy,
      isReviewSuccess: input.isReviewSuccess,
    });
    totalXp += xp.total;
  }

  const masteryDeltas: { skillId: string; before: number; after: number }[] = [];
  const skills = { ...state.skills };
  for (const skillId of input.skillIds) {
    const before = skills[skillId] ?? createInitialUserSkillStats();
    const after = updateMastery(before, {
      cleared: input.cleared,
      firstAttempt: firstAttemptClear,
      hintsUsed: input.hintsUsed,
      isRetrySuccess: input.isRetrySuccess,
      isReviewSuccess: input.isReviewSuccess,
      explainedWhy: input.explainedWhy,
    });
    skills[skillId] = after;
    masteryDeltas.push({ skillId, before: before.masteryScore, after: after.masteryScore });
  }

  const streakUpdate = input.cleared
    ? recordActivity(state.streak, input.now)
    : { state: state.streak, change: "already-active-today" as const };

  const achievementStats: AchievementStats = { ...state.achievementStats };
  if (input.cleared) {
    achievementStats.totalQuestsCleared += 1;
    if (input.questCategory === "data-investigation" && input.hintsUsed === 0) {
      achievementStats.investigationCluesFoundNoHint += 1;
    }
    if (input.hintsUsed === 1) {
      achievementStats.hintLevel1OnlyClears += 1;
    }
    if (input.questCategory === "pipeline-debugging") {
      achievementStats.pipelineQuestsCleared += 1;
    }
    if (input.questCategory === "data-modeling") {
      achievementStats.dataModelingQuestsCleared += 1;
    }
  }

  const previouslyUnlocked = new Set(state.unlockedAchievementIds);
  const nowUnlocked = evaluateAchievements(achievementStats);
  const newlyUnlockedAchievementIds = nowUnlocked.filter((id) => !previouslyUnlocked.has(id));

  const nextState: QuestCompletionState = {
    totalXp,
    skills,
    streak: streakUpdate.state,
    achievementStats,
    unlockedAchievementIds: Array.from(new Set([...state.unlockedAchievementIds, ...nowUnlocked])),
  };

  return { xp, streakUpdate, newlyUnlockedAchievementIds, masteryDeltas, state: nextState };
}
