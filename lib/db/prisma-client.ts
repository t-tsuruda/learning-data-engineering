/**
 * Full Mode専用のPrismaClient（server-only）。
 * DATABASE_URL（Supabase Poolerを推奨、docs/architecture.md §5参照）を
 * @prisma/adapter-pg 経由で使う。Demo Modeではこのモジュールは読み込まれない。
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

let client: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (client) return client;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Full Mode requires a Supabase Postgres connection.");
  }

  const adapter = new PrismaPg({ connectionString });
  client = new PrismaClient({ adapter });
  return client;
}

/** Full Modeが有効(=DATABASE_URLが設定されている)かどうか。docs/architecture.md §4のモード判定に使う。 */
export function isFullModeConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
