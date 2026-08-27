/**
 * Skill Tree（prd.md §29）の表示用カタログ。Questコンテンツ中のskill idと対応させる。
 * 新しいQuestを追加する際、新しいskill idを使う場合はここにも追加する。
 */

export interface SkillDef {
  id: string;
  name: string;
  category: "SQL" | "Data Investigation" | "Data Modeling" | "ETL" | "Pipeline" | "Databricks";
}

export const SKILL_CATALOG: SkillDef[] = [
  { id: "sql-select", name: "SELECT / 基本文法", category: "SQL" },
  { id: "sql-where", name: "WHERE / 条件抽出", category: "SQL" },
  { id: "sql-null-handling", name: "NULLの扱い", category: "SQL" },
  { id: "sql-join", name: "JOIN", category: "SQL" },
  { id: "sql-group-by", name: "GROUP BY", category: "SQL" },
  { id: "sql-aggregation", name: "集計関数", category: "SQL" },
  { id: "sql-window-functions", name: "Window関数", category: "SQL" },
  { id: "data-investigation", name: "データ調査", category: "Data Investigation" },
  { id: "data-modeling", name: "データモデリング", category: "Data Modeling" },
  { id: "star-schema", name: "スタースキーマ", category: "Data Modeling" },
  { id: "etl-design", name: "ETL設計", category: "ETL" },
  { id: "medallion-architecture", name: "Bronze/Silver/Gold", category: "ETL" },
  { id: "pipeline-debugging", name: "パイプライン障害調査", category: "Pipeline" },
  { id: "job-logs", name: "Job Log読解", category: "Pipeline" },
  { id: "databricks-workspace", name: "Databricks Workspace", category: "Databricks" },
];

const CATALOG_MAP = new Map(SKILL_CATALOG.map((s) => [s.id, s]));

export function getSkillDef(skillId: string): SkillDef {
  return CATALOG_MAP.get(skillId) ?? { id: skillId, name: skillId, category: "SQL" };
}

export const SKILL_CATEGORIES = ["SQL", "Data Investigation", "Data Modeling", "ETL", "Pipeline", "Databricks"] as const;
