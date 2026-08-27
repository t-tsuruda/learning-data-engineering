/**
 * SQL提出の採点フロー。ユーザーのSQLと期待値SQLを、それぞれ初期化直後のクリーンな
 * データセットに対して実行し比較する（ユーザーのSQLがテーブルを変更していても
 * 公平に採点できるようにするため）。
 */
import { compareResultSets, type SqlResultRow } from "@/lib/domain/grading";
import type { Quest } from "@/lib/quest/schema";
import type { QueryError, QueryResult } from "@/lib/platform-adapter/types";

export interface EvaluateSubmissionDeps {
  run: (sql: string) => Promise<{ result?: QueryResult; error?: QueryError }>;
  resetToSeed: () => Promise<void>;
}

export interface EvaluateSubmissionResult {
  passed: boolean;
  reason?: string;
  userResult?: QueryResult;
  userError?: QueryError;
}

export async function evaluateSqlSubmission(
  quest: Quest,
  userSql: string,
  deps: EvaluateSubmissionDeps,
): Promise<EvaluateSubmissionResult> {
  if (quest.successCriteria.type !== "sql-result-match") {
    throw new Error("evaluateSqlSubmission called on a non-SQL quest");
  }

  await deps.resetToSeed();
  const userRun = await deps.run(userSql);
  if (userRun.error) {
    return { passed: false, reason: userRun.error.message, userError: userRun.error };
  }

  await deps.resetToSeed();
  const expectedRun = await deps.run(quest.successCriteria.expectedSql);
  if (expectedRun.error) {
    // Quest content側の不具合。ユーザーに責任はないため明示的なメッセージにする。
    throw new Error(`Quest content error while grading: ${expectedRun.error.message}`);
  }

  const comparison = compareResultSets(
    (userRun.result?.rows ?? []) as SqlResultRow[],
    (expectedRun.result?.rows ?? []) as SqlResultRow[],
    { orderMatters: quest.successCriteria.orderMatters },
  );

  return { passed: comparison.passed, reason: comparison.reason, userResult: userRun.result };
}
