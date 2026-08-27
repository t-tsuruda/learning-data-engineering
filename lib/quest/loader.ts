/**
 * content/quests/*.json をサーバー起動時に読み込み・バリデーションする（server-only）。
 * Contentとアプリロジックを分離する方針（dev-requirements-addendum.md §3.1, prd.md §70）。
 */
import fs from "node:fs";
import path from "node:path";
import { type Quest, questSchema } from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "quests");

let cache: Quest[] | null = null;

function loadAll(): Quest[] {
  if (cache) return cache;

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  const quests: Quest[] = [];
  const seenIds = new Set<string>();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      throw new Error(`Quest content "${file}" is not valid JSON: ${(err as Error).message}`);
    }
    const result = questSchema.safeParse(json);
    if (!result.success) {
      throw new Error(
        `Quest content "${file}" failed validation:\n${result.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n")}`,
      );
    }
    if (seenIds.has(result.data.id)) {
      throw new Error(`Duplicate quest id "${result.data.id}" found in "${file}"`);
    }
    seenIds.add(result.data.id);
    quests.push(result.data);
  }

  cache = quests.sort((a, b) => a.id.localeCompare(b.id));
  return cache;
}

export function getAllQuests(): Quest[] {
  return loadAll();
}

export function getQuestById(id: string): Quest | undefined {
  return loadAll().find((q) => q.id === id);
}

export function getQuestsByCategory(category: string): Quest[] {
  return loadAll().filter((q) => q.category === category);
}

export interface QuestSummary {
  id: string;
  title: string;
  category: Quest["category"];
  difficulty: Quest["difficulty"];
  type: Quest["type"];
  skills: string[];
  estimatedMinutes: number;
  xpBase: number;
}

export function toQuestSummary(quest: Quest): QuestSummary {
  return {
    id: quest.id,
    title: quest.title,
    category: quest.category,
    difficulty: quest.difficulty,
    type: quest.type,
    skills: quest.skills,
    estimatedMinutes: quest.estimatedMinutes,
    xpBase: quest.xp.base,
  };
}

export function getAllQuestSummaries(): QuestSummary[] {
  return loadAll().map(toQuestSummary);
}
