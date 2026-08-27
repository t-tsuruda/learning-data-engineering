"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/supabase-server";
import { getRepository } from "@/lib/db";
import type { ProgressSnapshot } from "@/lib/db/repository";
import type { QuestCompletionResult } from "@/lib/domain/progress-engine";

const confidenceLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

const completeQuestInputSchema = z.object({
  questId: z.string().min(1),
  questCategory: z.string().min(1),
  skillIds: z.array(z.string().min(1)).min(1),
  baseXp: z.number().int().positive(),
  attemptCount: z.number().int().positive(),
  hintsUsed: z.number().int().min(0),
  goodInvestigation: z.boolean(),
  explainedWhy: z.boolean(),
  confidenceBefore: confidenceLevelSchema.optional(),
  confidenceAfter: confidenceLevelSchema.optional(),
  idempotencyKey: z.string().uuid(),
});

export type CompleteQuestActionInput = z.infer<typeof completeQuestInputSchema>;

/**
 * ログイン中ユーザーの進捗スナップショットを取得する。Full Mode専用。
 * user.idは常にサーバー側で取得したセッションから決定し、クライアントからは受け取らない
 * （所有者チェックの多層防御, dev-requirements-addendum.md §4.2.5）。
 */
export async function getMyProgressSnapshotAction(): Promise<ProgressSnapshot | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const repository = getRepository();
  await repository.ensureProfile(user.id, (user.user_metadata?.display_name as string | undefined) ?? "Rookie");
  return repository.getProgressSnapshot(user.id);
}

export async function completeQuestAction(rawInput: CompleteQuestActionInput): Promise<QuestCompletionResult> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("ログインが必要です");
  }

  const input = completeQuestInputSchema.parse(rawInput);
  const repository = getRepository();
  return repository.completeQuest(user.id, input);
}
