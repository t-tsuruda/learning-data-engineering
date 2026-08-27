import type { QuestCategory, QuestDifficulty } from "@/lib/quest/schema";

export const CATEGORY_META: Record<QuestCategory, { label: string; emoji: string; description: string }> = {
  "sql-fundamentals": { label: "SQL Fundamentals", emoji: "⚔️", description: "SELECT, JOIN, GROUP BY, Window関数など" },
  "data-investigation": { label: "Data Investigation", emoji: "🔍", description: "ログやデータから原因を突き止める" },
  "data-modeling": { label: "Data Modeling", emoji: "🏗️", description: "スキーマ設計・分析しやすいデータ構造" },
  etl: { label: "ETL", emoji: "🔧", description: "生データを使える形に変換するパイプライン" },
  "pipeline-debugging": { label: "Pipeline Debugging", emoji: "🛠️", description: "壊れたパイプラインを調査・修復する" },
  "databricks-intro": { label: "Databricks Intro", emoji: "🟦", description: "Databricksの基本概念を体験する" },
};

export const DIFFICULTY_META: Record<QuestDifficulty, { label: string; order: number }> = {
  tutorial: { label: "Tutorial", order: 0 },
  easy: { label: "Easy", order: 1 },
  normal: { label: "Normal", order: 2 },
  hard: { label: "Hard", order: 3 },
  expert: { label: "Expert", order: 4 },
  boss: { label: "Boss", order: 5 },
};
