"use client";

/**
 * Demo Mode用の進捗ストア。ブラウザのlocalStorageに永続化する（zustand persist）。
 * Full Mode移行時は、このストアの代わりにServer Actions + lib/db/prisma-repositoryが
 * 同じ lib/domain の純粋関数を呼び出す（docs/architecture.md §4.1）。
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyQuestCompletion,
  createInitialProgressState,
  type QuestCompletionResult,
  type QuestCompletionState,
} from "@/lib/domain/progress-engine";
import type { ConfidenceLevel } from "@/lib/domain/confidence";

export interface QuestAttemptRecord {
  status: "cleared";
  attemptCount: number;
  hintsUsed: number;
  confidenceBefore?: ConfidenceLevel;
  confidenceAfter?: ConfidenceLevel;
  clearedAt: string;
}

export interface ConfidenceHistoryEntry {
  skillId: string;
  questId: string;
  level: ConfidenceLevel;
  recordedAt: string;
}

interface ProgressStoreState {
  displayName: string;
  onboarded: boolean;
  progress: QuestCompletionState;
  questAttempts: Record<string, QuestAttemptRecord>;
  confidenceHistory: ConfidenceHistoryEntry[];

  setDisplayName: (name: string) => void;
  completeOnboarding: () => void;
  completeQuest: (input: {
    questId: string;
    questCategory: string;
    skillIds: string[];
    baseXp: number;
    attemptCount: number;
    hintsUsed: number;
    goodInvestigation: boolean;
    explainedWhy: boolean;
    confidenceBefore?: ConfidenceLevel;
    confidenceAfter?: ConfidenceLevel;
  }) => QuestCompletionResult;
  isQuestCleared: (questId: string) => boolean;
  resetAll: () => void;
}

export const useProgressStore = create<ProgressStoreState>()(
  persist(
    (set, get) => ({
      displayName: "",
      onboarded: false,
      progress: createInitialProgressState(),
      questAttempts: {},
      confidenceHistory: [],

      setDisplayName: (name) => set({ displayName: name }),
      completeOnboarding: () => set({ onboarded: true }),

      isQuestCleared: (questId) => get().questAttempts[questId]?.status === "cleared",

      completeQuest: (input) => {
        const now = new Date();
        const alreadyCleared = get().isQuestCleared(input.questId);
        const result = applyQuestCompletion(get().progress, {
          questId: input.questId,
          questCategory: input.questCategory,
          skillIds: input.skillIds,
          baseXp: input.baseXp,
          cleared: true,
          attemptCount: input.attemptCount,
          hintsUsed: input.hintsUsed,
          goodInvestigation: input.goodInvestigation,
          explainedWhy: input.explainedWhy,
          // 一度クリア済みのQuestを再挑戦した場合はRetry Successとして扱う
          isRetrySuccess: alreadyCleared,
          isReviewSuccess: false,
          confidenceBefore: input.confidenceBefore,
          confidenceAfter: input.confidenceAfter,
          now,
        });

        const confidenceEntries: ConfidenceHistoryEntry[] =
          input.confidenceAfter !== undefined
            ? input.skillIds.map((skillId) => ({
                skillId,
                questId: input.questId,
                level: input.confidenceAfter as ConfidenceLevel,
                recordedAt: now.toISOString(),
              }))
            : [];

        set((state) => ({
          progress: result.state,
          questAttempts: {
            ...state.questAttempts,
            [input.questId]: {
              status: "cleared",
              attemptCount: input.attemptCount,
              hintsUsed: input.hintsUsed,
              confidenceBefore: input.confidenceBefore,
              confidenceAfter: input.confidenceAfter,
              clearedAt: now.toISOString(),
            },
          },
          confidenceHistory: [...state.confidenceHistory, ...confidenceEntries],
        }));

        return result;
      },

      resetAll: () =>
        set({
          displayName: "",
          onboarded: false,
          progress: createInitialProgressState(),
          questAttempts: {},
          confidenceHistory: [],
        }),
    }),
    { name: "deq-progress-store-v1" },
  ),
);
