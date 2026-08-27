import type { ProgressRepository } from "./repository";
import { PrismaProgressRepository } from "./prisma-repository";

let cached: ProgressRepository | null = null;

/** Full Mode専用。Demo Modeはこのモジュールを使わずクライアント側のzustand storeで完結する。 */
export function getRepository(): ProgressRepository {
  if (!cached) cached = new PrismaProgressRepository();
  return cached;
}

export type { ProgressRepository, ProgressSnapshot, CompleteQuestInput } from "./repository";
