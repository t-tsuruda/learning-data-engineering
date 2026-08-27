// Prisma CLI設定（Full Mode用）。
// CLI（migrate/generate/studio）は DIRECT_URL（非Pooler、DDL/advisory lock安定のため）を使う。
// アプリ実行時のPrismaClientは lib/db/prisma-client.ts で DATABASE_URL（Poolerを推奨）を
// @prisma/adapter-pg 経由で使う。両者は別経路なので混同しないこと（docs/architecture.md §5参照）。
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
