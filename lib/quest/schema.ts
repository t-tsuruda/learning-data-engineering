/**
 * Questコンテンツのスキーマ定義（dev-requirements-addendum.md §3.1）。
 * content/quests/*.json はこのスキーマでビルド時にバリデーションされる。
 * 不正なQuestファイルがあればビルドを失敗させる（lib/quest/loader.ts）。
 */
import { z } from "zod";

export const QUEST_CATEGORIES = [
  "sql-fundamentals",
  "data-investigation",
  "data-modeling",
  "etl",
  "pipeline-debugging",
  "databricks-intro",
] as const;

export const QUEST_DIFFICULTIES = ["tutorial", "easy", "normal", "hard", "expert", "boss"] as const;

export const QUEST_TYPES = ["investigation", "sql-fix", "sql-write", "decision", "design"] as const;

export const QUEST_PLATFORMS = ["duckdb", "databricks", "snowflake"] as const;

const hintSchema = z.object({
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  text: z.string().min(1),
});

const datasetTableSchema = z.object({
  name: z.string().min(1),
  /** テーブル作成+初期データ投入用のSQL（DuckDB-Wasm上で実行） */
  seedSql: z.string().min(1),
});

const sqlResultMatchCriteriaSchema = z.object({
  type: z.literal("sql-result-match"),
  /** 正解データセットに対して実行し、ユーザーの実行結果と比較する基準SQL */
  expectedSql: z.string().min(1),
  orderMatters: z.boolean().optional(),
});

const choiceCriteriaSchema = z.object({
  type: z.literal("choice"),
  correctOptionIds: z.array(z.string()).min(1),
});

const successCriteriaSchema = z.discriminatedUnion("type", [sqlResultMatchCriteriaSchema, choiceCriteriaSchema]);

const decisionOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

const xpSchema = z.object({
  base: z.number().int().positive(),
});

export const questSchema = z
  .object({
    id: z.string().regex(/^quest-[a-z0-9-]+$/, "idは 'quest-xxx' 形式にする"),
    title: z.string().min(1),
    category: z.enum(QUEST_CATEGORIES),
    difficulty: z.enum(QUEST_DIFFICULTIES),
    platform: z.enum(QUEST_PLATFORMS).default("duckdb"),
    skills: z.array(z.string().min(1)).min(1),
    estimatedMinutes: z.number().int().positive().max(60),
    type: z.enum(QUEST_TYPES),
    story: z.object({
      context: z.string().min(1),
      request: z.string().min(1),
    }),
    mission: z.string().min(1),
    dataset: z.object({ tables: z.array(datasetTableSchema).min(1) }).optional(),
    /** SQL Editorに最初から入れておくコード（sql-fixで壊れたSQLを渡す用途など） */
    starterSql: z.string().optional(),
    options: z.array(decisionOptionSchema).optional(),
    hints: z.array(hintSchema).max(3).default([]),
    answer: z.object({
      explanation: z.string().min(1),
      sql: z.string().optional(),
    }),
    successCriteria: successCriteriaSchema,
    reflectionPrompt: z.string().min(1),
    xp: xpSchema,
  })
  .superRefine((quest, ctx) => {
    if (quest.type === "decision" && (!quest.options || quest.options.length < 2)) {
      ctx.addIssue({
        code: "custom",
        message: "type: 'decision' のQuestには2つ以上の options が必要です",
        path: ["options"],
      });
    }
    if (quest.type !== "decision" && !quest.dataset) {
      ctx.addIssue({
        code: "custom",
        message: "SQLを扱うQuestには dataset が必要です",
        path: ["dataset"],
      });
    }
    if (quest.successCriteria.type === "choice" && quest.type !== "decision") {
      ctx.addIssue({
        code: "custom",
        message: "successCriteria.type: 'choice' は type: 'decision' のQuestでのみ使用できます",
        path: ["successCriteria"],
      });
    }
  });

export type Quest = z.infer<typeof questSchema>;
export type QuestCategory = (typeof QUEST_CATEGORIES)[number];
export type QuestDifficulty = (typeof QUEST_DIFFICULTIES)[number];
