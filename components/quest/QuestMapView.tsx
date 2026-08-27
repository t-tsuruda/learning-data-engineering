"use client";

import Link from "next/link";
import { useProgressStore } from "@/lib/state/progress-store";
import { useHydrated } from "@/lib/state/useHydrated";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/domain/category-catalog";
import type { QuestSummary } from "@/lib/quest/loader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function QuestMapView({ quests }: { quests: QuestSummary[] }) {
  const hydrated = useHydrated();
  const questAttempts = useProgressStore((s) => s.questAttempts);

  const byCategory = new Map<string, QuestSummary[]>();
  for (const q of quests) {
    const list = byCategory.get(q.category) ?? [];
    list.push(q);
    byCategory.set(q.category, list);
  }
  for (const list of byCategory.values()) {
    list.sort((a, b) => DIFFICULTY_META[a.difficulty].order - DIFFICULTY_META[b.difficulty].order);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Quest Map</h1>
        <p className="mt-1 text-sm text-text-secondary">
          今日どのQuestに挑戦しますか？順番は決まっていません。気になるものから始めてください。
        </p>
      </div>

      {Array.from(byCategory.entries()).map(([category, categoryQuests]) => {
        const meta = CATEGORY_META[category as keyof typeof CATEGORY_META];
        return (
          <section key={category}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-primary">
              <span aria-hidden>{meta.emoji}</span>
              {meta.label}
              <span className="text-xs font-normal text-text-muted">{meta.description}</span>
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categoryQuests.map((quest) => {
                const cleared = hydrated && questAttempts[quest.id]?.status === "cleared";
                return (
                  <Link key={quest.id} href={`/quests/${quest.id}`}>
                    <Card className="h-full transition-colors hover:border-accent/50">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-text-primary">{quest.title}</h3>
                        {cleared ? <span aria-label="クリア済み" title="クリア済み">✅</span> : null}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge>{DIFFICULTY_META[quest.difficulty].label}</Badge>
                        <Badge variant="accent">約{quest.estimatedMinutes}分</Badge>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
