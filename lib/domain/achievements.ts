/**
 * Achievement（prd.md §44）。単なるコレクションではなく、行動の意味を表すバッジにする。
 */

export interface AchievementDef {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-step",
    title: "First Step",
    emoji: "🌱",
    description: "最初のQuestをクリアした。",
  },
  {
    id: "detective",
    title: "Detective",
    emoji: "🔎",
    description: "3回、ヒントなしでログ・データから自力で原因を特定した。",
  },
  {
    id: "think-first",
    title: "Think First",
    emoji: "🧠",
    description: "5回、最初のヒント（方向性のヒント）だけでQuestを解決した。",
  },
  {
    id: "debugger",
    title: "Debugger",
    emoji: "🔥",
    description: "5つのPipeline障害Questを解決した。",
  },
  {
    id: "architect",
    title: "Architect",
    emoji: "🏗",
    description: "3つのData Modeling Questを完了した。",
  },
];

export interface AchievementStats {
  investigationCluesFoundNoHint: number;
  hintLevel1OnlyClears: number;
  pipelineQuestsCleared: number;
  dataModelingQuestsCleared: number;
  totalQuestsCleared: number;
}

export function createInitialAchievementStats(): AchievementStats {
  return {
    investigationCluesFoundNoHint: 0,
    hintLevel1OnlyClears: 0,
    pipelineQuestsCleared: 0,
    dataModelingQuestsCleared: 0,
    totalQuestsCleared: 0,
  };
}

/** 現在の統計から、達成条件を満たしているAchievement idの一覧を返す */
export function evaluateAchievements(stats: AchievementStats): string[] {
  const unlocked: string[] = [];
  if (stats.totalQuestsCleared >= 1) unlocked.push("first-step");
  if (stats.investigationCluesFoundNoHint >= 3) unlocked.push("detective");
  if (stats.hintLevel1OnlyClears >= 5) unlocked.push("think-first");
  if (stats.pipelineQuestsCleared >= 5) unlocked.push("debugger");
  if (stats.dataModelingQuestsCleared >= 3) unlocked.push("architect");
  return unlocked;
}
