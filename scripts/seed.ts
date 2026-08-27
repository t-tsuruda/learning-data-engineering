/**
 * Full Mode用のマスタデータ投入スクリプト（skills, achievements）。
 * Demo Modeでは使用しない。実行にはSupabase Postgresへの接続が必要（DATABASE_URL）。
 * dev-requirements-addendum.md §3.3: `pnpm db:seed` で開発用ダミーユーザー・マスタデータを投入する。
 */
import { getPrismaClient } from "../lib/db/prisma-client";
import { SKILL_CATALOG } from "../lib/domain/skills-catalog";
import { ACHIEVEMENTS } from "../lib/domain/achievements";

async function main() {
  const prisma = getPrismaClient();

  for (const skill of SKILL_CATALOG) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: { name: skill.name, category: skill.category },
      create: { id: skill.id, name: skill.name, category: skill.category },
    });
  }
  console.log(`✔ Seeded ${SKILL_CATALOG.length} skills`);

  for (const achievement of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: { title: achievement.title, description: achievement.description, icon: achievement.emoji },
      create: {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.emoji,
      },
    });
  }
  console.log(`✔ Seeded ${ACHIEVEMENTS.length} achievements`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(async () => {
    const prisma = getPrismaClient();
    await prisma.$disconnect();
  });
