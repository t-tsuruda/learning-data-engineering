/**
 * Streak（prd.md §20）。途切れても自己嫌悪にならない設計にする。
 * 「7日続けた。十分すごい。また今日から1日目を始めよう。」のようなメッセージを添える。
 */
import { diffJstDays, toJstDateKey } from "./datetime";

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  /** JST基準の日付キー（YYYY-MM-DD）。未活動なら null */
  lastActiveDateKey: string | null;
}

export interface StreakUpdateResult {
  state: StreakState;
  /** 今回の活動でStreakが継続/開始/リセットされたか */
  change: "continued" | "started" | "already-active-today" | "reset";
  /** リセットが発生した場合、直前まで積み上げていた日数（UIで讃えるために使う） */
  previousStreakBeforeReset?: number;
}

export function createInitialStreakState(): StreakState {
  return { currentStreak: 0, longestStreak: 0, lastActiveDateKey: null };
}

export function recordActivity(state: StreakState, now: Date): StreakUpdateResult {
  const todayKey = toJstDateKey(now);

  if (state.lastActiveDateKey === todayKey) {
    return { state, change: "already-active-today" };
  }

  if (state.lastActiveDateKey === null) {
    const next: StreakState = { currentStreak: 1, longestStreak: Math.max(1, state.longestStreak), lastActiveDateKey: todayKey };
    return { state: next, change: "started" };
  }

  const gap = diffJstDays(state.lastActiveDateKey, todayKey);

  if (gap === 1) {
    const currentStreak = state.currentStreak + 1;
    const next: StreakState = {
      currentStreak,
      longestStreak: Math.max(currentStreak, state.longestStreak),
      lastActiveDateKey: todayKey,
    };
    return { state: next, change: "continued" };
  }

  // gap >= 2（1日以上空いた）: 罰さず1日目からやり直す
  const previousStreakBeforeReset = state.currentStreak;
  const next: StreakState = { currentStreak: 1, longestStreak: state.longestStreak, lastActiveDateKey: todayKey };
  return { state: next, change: "reset", previousStreakBeforeReset };
}
