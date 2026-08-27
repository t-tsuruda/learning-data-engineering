import { describe, expect, it } from "vitest";
import { createInitialStreakState, recordActivity } from "@/lib/domain/streak";

// JSTは UTC+9。UTCの日付を意図的にまたぐ時刻を使ってタイムゾーン境界を検証する。
const jst = (isoUtc: string) => new Date(isoUtc);

describe("recordActivity", () => {
  it("starts a streak at 1 on first activity", () => {
    const result = recordActivity(createInitialStreakState(), jst("2026-08-01T10:00:00Z"));
    expect(result.change).toBe("started");
    expect(result.state.currentStreak).toBe(1);
  });

  it("does not double-count activity on the same JST day", () => {
    // 2026-08-01 01:00 UTC = 2026-08-01 10:00 JST, 2026-08-01 10:00 UTC = 2026-08-01 19:00 JST (same JST day)
    const first = recordActivity(createInitialStreakState(), jst("2026-08-01T01:00:00Z"));
    const second = recordActivity(first.state, jst("2026-08-01T10:00:00Z"));
    expect(second.change).toBe("already-active-today");
    expect(second.state.currentStreak).toBe(1);
  });

  it("continues the streak on the next JST day", () => {
    const day1 = recordActivity(createInitialStreakState(), jst("2026-08-01T10:00:00Z"));
    const day2 = recordActivity(day1.state, jst("2026-08-02T10:00:00Z"));
    expect(day2.change).toBe("continued");
    expect(day2.state.currentStreak).toBe(2);
  });

  it("treats 23:xx JST and next-day 00:xx JST as different days (JST boundary, not UTC)", () => {
    // 2026-08-01 23:30 JST = 2026-08-01 14:30 UTC
    const day1 = recordActivity(createInitialStreakState(), jst("2026-08-01T14:30:00Z"));
    // 2026-08-02 00:30 JST = 2026-08-01 15:30 UTC
    const day2 = recordActivity(day1.state, jst("2026-08-01T15:30:00Z"));
    expect(day2.change).toBe("continued");
  });

  it("resets without penalty after a gap, but keeps longestStreak", () => {
    const day1 = recordActivity(createInitialStreakState(), jst("2026-08-01T10:00:00Z"));
    const day2 = recordActivity(day1.state, jst("2026-08-02T10:00:00Z"));
    const day3 = recordActivity(day2.state, jst("2026-08-03T10:00:00Z"));
    // skip several days
    const restart = recordActivity(day3.state, jst("2026-08-10T10:00:00Z"));
    expect(restart.change).toBe("reset");
    expect(restart.state.currentStreak).toBe(1);
    expect(restart.previousStreakBeforeReset).toBe(3);
    expect(restart.state.longestStreak).toBe(3);
  });
});
