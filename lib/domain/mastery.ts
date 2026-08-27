/**
 * Mastery System（prd.md §13）。
 * 単純な正解率をMastery Scoreにしない。初回正答・ヒント使用・再挑戦・類題成功・
 * 時間経過後の再テスト・説明能力を組み合わせて0-100のスコアを漸進的に更新する。
 *
 * 加点幅は初期値としてClaude Codeが設計したチューニング可能な定数であり、
 * 実データが集まった段階で見直すことを想定する。
 */

export interface UserSkillStats {
  masteryScore: number; // 0-100
  firstTryCount: number;
  hintUsedCount: number;
  retryCount: number;
}

export interface AttemptOutcome {
  cleared: boolean;
  firstAttempt: boolean;
  hintsUsed: number;
  /** 過去に失敗した後の再挑戦での成功か */
  isRetrySuccess: boolean;
  /** Spaced Reviewとしての再挑戦か（記憶の定着を強く示す信号） */
  isReviewSuccess: boolean;
  explainedWhy: boolean;
}

export function createInitialUserSkillStats(): UserSkillStats {
  return { masteryScore: 0, firstTryCount: 0, hintUsedCount: 0, retryCount: 0 };
}

const DELTA = {
  clearedFirstTryNoHint: 12,
  clearedWithHint: 8,
  clearedRetrySuccess: 10,
  clearedReviewSuccess: 15,
  explainedWhyBonus: 5,
  // 失敗しても「学習データ」として小さく前進させる（罰しない, prd.md §11）
  attemptedNotCleared: 2,
} as const;

export function updateMastery(current: UserSkillStats, outcome: AttemptOutcome): UserSkillStats {
  let delta = 0;

  if (outcome.cleared) {
    if (outcome.isReviewSuccess) {
      delta = DELTA.clearedReviewSuccess;
    } else if (outcome.isRetrySuccess) {
      delta = DELTA.clearedRetrySuccess;
    } else if (outcome.firstAttempt && outcome.hintsUsed === 0) {
      delta = DELTA.clearedFirstTryNoHint;
    } else {
      delta = DELTA.clearedWithHint;
    }
    if (outcome.explainedWhy) delta += DELTA.explainedWhyBonus;
  } else {
    delta = DELTA.attemptedNotCleared;
  }

  const masteryScore = Math.min(100, Math.max(0, current.masteryScore + delta));

  return {
    masteryScore,
    firstTryCount: current.firstTryCount + (outcome.cleared && outcome.firstAttempt ? 1 : 0),
    hintUsedCount: current.hintUsedCount + (outcome.hintsUsed > 0 ? 1 : 0),
    retryCount: current.retryCount + (outcome.isRetrySuccess ? 1 : 0),
  };
}

export function masteryLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 40) return "Developing";
  return "Beginner";
}
