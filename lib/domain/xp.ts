/**
 * XP計算ロジック（prd.md §43）。
 * 「正解したら100XPだけ」にせず、調査の質・ヒント利用・振り返りなど複数要素を評価する。
 * ヒント利用には大きなペナルティを与えない（助けを求めることを悪としない、prd.md §43）。
 */

export interface QuestXpInput {
  /** Questコンテンツのxp.base（Boss Questは content 側で500等の大きい値を設定する） */
  baseXp: number;
  /** 1回目の提出でヒントなしにクリアできたか */
  firstAttemptClear: boolean;
  /** ヒントを使う前にデータ確認などの調査を行ったか（Quest UI側で判定してフラグを渡す） */
  goodInvestigation: boolean;
  /** このAttemptで使用したヒント数（0-3） */
  hintsUsed: number;
  /** 振り返り(Why?)に回答したか */
  explainedWhy: boolean;
  /** Spaced Reviewとしての再挑戦を成功させたか */
  isReviewSuccess: boolean;
}

export interface QuestXpBreakdown {
  questClear: number;
  firstAttempt: number;
  goodInvestigation: number;
  hintUsed: number;
  explainedWhy: number;
  reviewSuccess: number;
  total: number;
}

const BONUS = {
  firstAttempt: 50,
  goodInvestigation: 30,
  hintUsed: 10,
  explainedWhy: 40,
  reviewSuccess: 50,
} as const;

export function calculateQuestXp(input: QuestXpInput): QuestXpBreakdown {
  const questClear = Math.max(0, Math.round(input.baseXp));
  const firstAttempt = input.firstAttemptClear ? BONUS.firstAttempt : 0;
  const goodInvestigation = input.goodInvestigation ? BONUS.goodInvestigation : 0;
  // ヒントは使うほど加点が増えるのではなく「使ったこと」自体を評価する（連打対策）
  const hintUsed = input.hintsUsed > 0 ? BONUS.hintUsed : 0;
  const explainedWhy = input.explainedWhy ? BONUS.explainedWhy : 0;
  const reviewSuccess = input.isReviewSuccess ? BONUS.reviewSuccess : 0;

  const total = questClear + firstAttempt + goodInvestigation + hintUsed + explainedWhy + reviewSuccess;

  return { questClear, firstAttempt, goodInvestigation, hintUsed, explainedWhy, reviewSuccess, total };
}
