/**
 * Confidence System（prd.md §27, §28）。
 * 「この問題、今なら一人で解けそう？」を5段階の絵文字スケールで記録し、
 * 他人との比較ではなく過去の自分との比較として時系列で見せる。
 */

export const CONFIDENCE_SCALE = [
  { level: 1, emoji: "😰", label: "まだ無理" },
  { level: 2, emoji: "😕", label: "ヒントがあれば" },
  { level: 3, emoji: "🙂", label: "たぶんできる" },
  { level: 4, emoji: "😎", label: "一人でできる" },
  { level: 5, emoji: "🔥", label: "他人にも説明できる" },
] as const;

export type ConfidenceLevel = (typeof CONFIDENCE_SCALE)[number]["level"];

export function confidenceEmoji(level: number): string {
  return CONFIDENCE_SCALE.find((c) => c.level === level)?.emoji ?? "🙂";
}

export function confidenceLabel(level: number): string {
  return CONFIDENCE_SCALE.find((c) => c.level === level)?.label ?? "";
}

export interface ConfidenceDelta {
  before: number;
  after: number;
  improved: boolean;
}

export function compareConfidence(before: number, after: number): ConfidenceDelta {
  return { before, after, improved: after > before };
}
