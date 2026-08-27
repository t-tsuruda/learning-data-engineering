/**
 * Full Mode用のProgressRepository実装（Prisma / Supabase Postgres）。
 * lib/domain/progress-engine.tsの純粋関数を使い、Demo Mode（zustand store）と
 * 同じロジックで状態遷移を計算してからDBへ永続化する。
 */
import { getPrismaClient } from "./prisma-client";
import type { CompleteQuestInput, ProgressRepository, ProgressSnapshot } from "./repository";
import {
  applyQuestCompletion,
  createInitialProgressState,
  type QuestCompletionResult,
  type QuestCompletionState,
} from "@/lib/domain/progress-engine";
import { createInitialAchievementStats, type AchievementStats } from "@/lib/domain/achievements";
import { toJstDateKey } from "@/lib/domain/datetime";
import type { UserSkillStats } from "@/lib/domain/mastery";
import type { QuestAttemptRecord, ConfidenceHistoryEntry } from "@/lib/state/progress-store";
import type { ConfidenceLevel } from "@/lib/domain/confidence";

function toDateOnlyUTC(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export class PrismaProgressRepository implements ProgressRepository {
  async ensureProfile(userId: string, defaultDisplayName: string): Promise<void> {
    const prisma = getPrismaClient();
    await prisma.profile.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, displayName: defaultDisplayName },
    });
  }

  private async loadState(userId: string): Promise<QuestCompletionState> {
    const prisma = getPrismaClient();
    const [profile, userSkills, streak, userAchievements] = await Promise.all([
      prisma.profile.findUniqueOrThrow({ where: { id: userId } }),
      prisma.userSkill.findMany({ where: { profileId: userId } }),
      prisma.streak.findUnique({ where: { profileId: userId } }),
      prisma.userAchievement.findMany({ where: { profileId: userId } }),
    ]);

    const skills: Record<string, UserSkillStats> = {};
    for (const s of userSkills) {
      skills[s.skillId] = {
        masteryScore: s.masteryScore,
        firstTryCount: s.firstTryCount,
        hintUsedCount: s.hintUsedCount,
        retryCount: s.retryCount,
      };
    }

    const achievementStats: AchievementStats = {
      ...createInitialAchievementStats(),
      ...(profile.achievementStats as Partial<AchievementStats>),
    };

    return {
      totalXp: profile.totalXp,
      skills,
      streak: streak
        ? {
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastActiveDateKey: streak.lastActiveDate ? toJstDateKey(streak.lastActiveDate) : null,
          }
        : createInitialProgressState().streak,
      achievementStats,
      unlockedAchievementIds: userAchievements.map((a) => a.achievementId),
    };
  }

  async getProgressSnapshot(userId: string): Promise<ProgressSnapshot> {
    const prisma = getPrismaClient();
    const [profile, state, attempts, confidenceRecords] = await Promise.all([
      prisma.profile.findUniqueOrThrow({ where: { id: userId } }),
      this.loadState(userId),
      prisma.questAttempt.findMany({ where: { profileId: userId, status: "cleared" } }),
      prisma.confidenceRecord.findMany({ where: { profileId: userId }, orderBy: { recordedAt: "asc" } }),
    ]);

    const questAttempts: Record<string, QuestAttemptRecord> = {};
    for (const a of attempts) {
      questAttempts[a.questId] = {
        status: "cleared",
        attemptCount: a.attemptCount,
        hintsUsed: a.hintsUsed,
        confidenceBefore: (a.confidenceBefore ?? undefined) as ConfidenceLevel | undefined,
        confidenceAfter: (a.confidenceAfter ?? undefined) as ConfidenceLevel | undefined,
        clearedAt: (a.completedAt ?? a.startedAt).toISOString(),
      };
    }

    const confidenceHistory: ConfidenceHistoryEntry[] = confidenceRecords.map((c) => ({
      skillId: c.skillId,
      questId: c.questId ?? "",
      level: c.level as ConfidenceLevel,
      recordedAt: c.recordedAt.toISOString(),
    }));

    return { displayName: profile.displayName, progress: state, questAttempts, confidenceHistory };
  }

  async completeQuest(userId: string, input: CompleteQuestInput): Promise<QuestCompletionResult> {
    const prisma = getPrismaClient();

    const existing = await prisma.questAttempt.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) {
      // 二重送信（連打・リトライ）: 既に処理済みなので追加の報酬は与えず現在の状態を返す
      const snapshot = await this.getProgressSnapshot(userId);
      return {
        streakUpdate: { state: snapshot.progress.streak, change: "already-active-today" },
        newlyUnlockedAchievementIds: [],
        masteryDeltas: [],
        state: snapshot.progress,
      };
    }

    const alreadyCleared = await prisma.questAttempt.findFirst({
      where: { profileId: userId, questId: input.questId, status: "cleared" },
      select: { id: true },
    });

    const currentState = await this.loadState(userId);
    const result = applyQuestCompletion(currentState, {
      questId: input.questId,
      questCategory: input.questCategory,
      skillIds: input.skillIds,
      baseXp: input.baseXp,
      cleared: true,
      attemptCount: input.attemptCount,
      hintsUsed: input.hintsUsed,
      goodInvestigation: input.goodInvestigation,
      explainedWhy: input.explainedWhy,
      isRetrySuccess: Boolean(alreadyCleared),
      isReviewSuccess: false,
      confidenceBefore: input.confidenceBefore,
      confidenceAfter: input.confidenceAfter,
      now: new Date(),
    });

    await prisma.$transaction(async (tx) => {
      await tx.questAttempt.create({
        data: {
          profileId: userId,
          questId: input.questId,
          status: "cleared",
          attemptCount: input.attemptCount,
          hintsUsed: input.hintsUsed,
          confidenceBefore: input.confidenceBefore,
          confidenceAfter: input.confidenceAfter,
          idempotencyKey: input.idempotencyKey,
          completedAt: new Date(),
        },
      });

      await tx.profile.update({
        where: { id: userId },
        data: { totalXp: result.state.totalXp, achievementStats: JSON.parse(JSON.stringify(result.state.achievementStats)) },
      });

      for (const skillId of input.skillIds) {
        const stats = result.state.skills[skillId];
        await tx.userSkill.upsert({
          where: { profileId_skillId: { profileId: userId, skillId } },
          update: {
            masteryScore: stats.masteryScore,
            firstTryCount: stats.firstTryCount,
            hintUsedCount: stats.hintUsedCount,
            retryCount: stats.retryCount,
          },
          create: {
            profileId: userId,
            skillId,
            masteryScore: stats.masteryScore,
            firstTryCount: stats.firstTryCount,
            hintUsedCount: stats.hintUsedCount,
            retryCount: stats.retryCount,
          },
        });
      }

      const streakState = result.streakUpdate.state;
      await tx.streak.upsert({
        where: { profileId: userId },
        update: {
          currentStreak: streakState.currentStreak,
          longestStreak: streakState.longestStreak,
          lastActiveDate: streakState.lastActiveDateKey ? toDateOnlyUTC(streakState.lastActiveDateKey) : null,
        },
        create: {
          profileId: userId,
          currentStreak: streakState.currentStreak,
          longestStreak: streakState.longestStreak,
          lastActiveDate: streakState.lastActiveDateKey ? toDateOnlyUTC(streakState.lastActiveDateKey) : null,
        },
      });

      for (const achievementId of result.newlyUnlockedAchievementIds) {
        await tx.userAchievement.upsert({
          where: { profileId_achievementId: { profileId: userId, achievementId } },
          update: {},
          create: { profileId: userId, achievementId },
        });
      }

      if (input.confidenceAfter !== undefined) {
        for (const skillId of input.skillIds) {
          await tx.confidenceRecord.create({
            data: { profileId: userId, skillId, questId: input.questId, level: input.confidenceAfter },
          });
        }
      }
    });

    return result;
  }
}
