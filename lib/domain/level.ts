/**
 * Career Journey（prd.md §16）。「教材番号」ではなく称号の変化として進行を表現する。
 * 称号取得自体を目的化しないため、UI上は「ここまでできるようになった」の補助表現として使う。
 */

export interface CareerRank {
  id: "rookie" | "junior" | "data-engineer" | "senior" | "platform-engineer";
  label: string;
  emoji: string;
  minXp: number;
}

export const CAREER_RANKS: CareerRank[] = [
  { id: "rookie", label: "Rookie", emoji: "🌱", minXp: 0 },
  { id: "junior", label: "Junior Data Engineer", emoji: "🧑‍💻", minXp: 500 },
  { id: "data-engineer", label: "Data Engineer", emoji: "⚙️", minXp: 1500 },
  { id: "senior", label: "Senior Data Engineer", emoji: "🧠", minXp: 3500 },
  { id: "platform-engineer", label: "Data Platform Engineer", emoji: "🏗️", minXp: 7000 },
];

export interface LevelProgress {
  rank: CareerRank;
  nextRank: CareerRank | null;
  /** 現ランク内での進捗率 0-1（次ランクが無い場合は1） */
  progressToNext: number;
  /** レベル表示用。100XPごとに1レベルという単純な換算（表示上の粒度のみに使用） */
  level: number;
}

export function getLevelProgress(totalXp: number): LevelProgress {
  const xp = Math.max(0, totalXp);
  let rankIndex = 0;
  for (let i = CAREER_RANKS.length - 1; i >= 0; i--) {
    if (xp >= CAREER_RANKS[i].minXp) {
      rankIndex = i;
      break;
    }
  }
  const rank = CAREER_RANKS[rankIndex];
  const nextRank = CAREER_RANKS[rankIndex + 1] ?? null;
  const progressToNext = nextRank
    ? (xp - rank.minXp) / (nextRank.minXp - rank.minXp)
    : 1;

  return {
    rank,
    nextRank,
    progressToNext: Math.min(1, Math.max(0, progressToNext)),
    level: Math.floor(xp / 100) + 1,
  };
}
