/**
 * このアプリの「1日」の境界はJST(UTC+9)の午前0時を基準とする（dev-requirements-addendum.md §7.3）。
 * DB保存はUTCのまま行い、Daily Quest/Streakの判定時だけJSTに変換する。
 */

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** UTCの任意時刻から「JST基準の日付」を YYYY-MM-DD 文字列で返す */
export function toJstDateKey(date: Date): string {
  const jst = new Date(date.getTime() + JST_OFFSET_MS);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 2つのJST日付キーの差分日数（b - a）。同日なら0、bがaの翌日なら1。 */
export function diffJstDays(aKey: string, bKey: string): number {
  const a = Date.parse(`${aKey}T00:00:00Z`);
  const b = Date.parse(`${bKey}T00:00:00Z`);
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

export function isSameJstDay(a: Date, b: Date): boolean {
  return toJstDateKey(a) === toJstDateKey(b);
}
