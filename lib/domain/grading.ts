/**
 * Questの正誤判定ロジック（クライアント実行結果の比較）。
 * dev-requirements-addendum.md §4.1: クライアント側実行結果はそのまま信頼しない方針だが、
 * 比較ロジック自体はDemo Mode/Full Modeで共通利用できるよう純粋関数として切り出す。
 * Full MoveでのXP付与時は、この関数の結果をサーバー側でも再実行して検証する想定（将来対応）。
 */

export type SqlResultRow = Record<string, unknown>;

export interface CompareOptions {
  /** 行の順序も一致させる必要があるか（デフォルトfalse: 集計結果などは順不同で許容） */
  orderMatters?: boolean;
}

export interface CompareResult {
  passed: boolean;
  reason?: string;
}

function normalizeValue(v: unknown): string {
  if (v === null || v === undefined) return "null";
  if (typeof v === "bigint") return v.toString();
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(6);
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function normalizeRow(row: SqlResultRow): string {
  const keys = Object.keys(row).sort();
  return keys.map((k) => `${k}=${normalizeValue(row[k])}`).join("|");
}

export function compareResultSets(
  actual: SqlResultRow[],
  expected: SqlResultRow[],
  options: CompareOptions = {},
): CompareResult {
  if (actual.length !== expected.length) {
    return {
      passed: false,
      reason: `行数が期待値と異なります（期待: ${expected.length}行, 実際: ${actual.length}行）`,
    };
  }

  const normalizedActual = actual.map(normalizeRow);
  const normalizedExpected = expected.map(normalizeRow);

  if (options.orderMatters) {
    for (let i = 0; i < normalizedActual.length; i++) {
      if (normalizedActual[i] !== normalizedExpected[i]) {
        return { passed: false, reason: `${i + 1}行目の内容が期待値と異なります` };
      }
    }
    return { passed: true };
  }

  const sortedActual = [...normalizedActual].sort();
  const sortedExpected = [...normalizedExpected].sort();
  for (let i = 0; i < sortedActual.length; i++) {
    if (sortedActual[i] !== sortedExpected[i]) {
      return { passed: false, reason: "結果の内容が期待値と一致しません" };
    }
  }
  return { passed: true };
}

export function compareChoice(selectedOptionId: string, correctOptionIds: string[]): CompareResult {
  const passed = correctOptionIds.includes(selectedOptionId);
  return passed ? { passed: true } : { passed: false, reason: "その選択は最適ではありません" };
}
