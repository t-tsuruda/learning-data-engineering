import { getAllQuests } from "../lib/quest/loader";

try {
  const quests = getAllQuests();
  console.log(`✔ ${quests.length} quest(s) validated successfully.`);
  for (const q of quests) {
    console.log(`  - ${q.id} [${q.category}/${q.difficulty}] ${q.title}`);
  }
} catch (err) {
  console.error("✘ Quest content validation failed:\n");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
