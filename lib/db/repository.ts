/**
 * Full Mode用のデータアクセス抽象化（docs/architecture.md §4.1）。
 * Server Actionsはこのインターフェースにのみ依存する。
 * lib/domainの純粋関数（XP/Mastery/Streak/Achievement計算）はDemo Mode（zustand store）と
 * 完全に共通利用する。
 */
import type { QuestCompletionResult, QuestCompletionState } from "@/lib/domain/progress-engine";
import type { ConfidenceLevel } from "@/lib/domain/confidence";
import type { ConfidenceHistoryEntry, QuestAttemptRecord } from "@/lib/state/progress-store";

export interface ProgressSnapshot {
  displayName: string;
  progress: QuestCompletionState;
  questAttempts: Record<string, QuestAttemptRecord>;
  confidenceHistory: ConfidenceHistoryEntry[];
}

export interface CompleteQuestInput {
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
  /** 二重送信防止用のクライアント発行キー（dev-requirements-addendum.md §7.2） */
  idempotencyKey: string;
}

export interface ProgressRepository {
  /** 初回ログイン時にProfileが無ければ作成する（冪等）。 */
  ensureProfile(userId: string, defaultDisplayName: string): Promise<void>;
  getProgressSnapshot(userId: string): Promise<ProgressSnapshot>;
  completeQuest(userId: string, input: CompleteQuestInput): Promise<QuestCompletionResult>;
}
