"use client";

import { useProgressStore } from "@/lib/state/progress-store";
import { useHydrated } from "@/lib/state/useHydrated";
import { getLevelProgress } from "@/lib/domain/level";
import { getSkillDef } from "@/lib/domain/skills-catalog";
import { masteryLabel } from "@/lib/domain/mastery";
import { confidenceEmoji } from "@/lib/domain/confidence";
import { ACHIEVEMENTS } from "@/lib/domain/achievements";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ProgressView() {
  const hydrated = useHydrated();
  const progress = useProgressStore((s) => s.progress);
  const confidenceHistory = useProgressStore((s) => s.confidenceHistory);

  if (!hydrated) return <div className="text-sm text-text-muted">読み込み中...</div>;

  const levelProgress = getLevelProgress(progress.totalXp);
  const skillEntries = Object.entries(progress.skills).sort((a, b) => b[1].masteryScore - a[1].masteryScore);

  const bySkill = new Map<string, typeof confidenceHistory>();
  for (const entry of confidenceHistory) {
    const list = bySkill.get(entry.skillId) ?? [];
    list.push(entry);
    bySkill.set(entry.skillId, list);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Progress</h1>
        <p className="mt-1 text-sm text-text-secondary">他人との比較ではなく、過去の自分との比較で成長を確認しましょう。</p>
      </div>

      <Card>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium text-text-primary">
            {levelProgress.rank.emoji} {levelProgress.rank.label}
          </span>
          <span className="text-xs text-text-muted">{progress.totalXp} XP · Lv.{levelProgress.level}</span>
        </div>
        <ProgressBar value={levelProgress.progressToNext * 100} />
      </Card>

      <Card>
        <p className="mb-3 text-xs font-medium tracking-wide text-text-secondary uppercase">Career Readiness</p>
        {skillEntries.length === 0 ? (
          <p className="text-sm text-text-muted">まだQuestに挑戦していません。まずは1つ、Questを完了してみましょう。</p>
        ) : (
          <div className="flex flex-col gap-2">
            {skillEntries.map(([skillId, stats]) => (
              <div key={skillId} className="flex items-center justify-between text-sm">
                <span className="text-text-primary">{getSkillDef(skillId).name}</span>
                <span className="text-text-secondary">{masteryLabel(stats.masteryScore)}</span>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-text-muted">
          基礎的な問題解決能力を身につけている段階です。次は実際のプロジェクトで経験を積む段階に向けて、Questを続けましょう。
        </p>
      </Card>

      {bySkill.size > 0 ? (
        <Card>
          <p className="mb-3 text-xs font-medium tracking-wide text-text-secondary uppercase">Confidence Timeline</p>
          <div className="flex flex-col gap-4">
            {Array.from(bySkill.entries()).map(([skillId, entries]) => (
              <div key={skillId}>
                <p className="mb-1 text-sm text-text-primary">{getSkillDef(skillId).name}</p>
                <div className="flex flex-wrap gap-2">
                  {entries.map((e, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-md bg-bg-elevated px-2 py-1 text-xs text-text-secondary">
                      {new Date(e.recordedAt).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                      <span className="text-sm">{confidenceEmoji(e.level)}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Card>
        <p className="mb-3 text-xs font-medium tracking-wide text-text-secondary uppercase">Achievements</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = progress.unlockedAchievementIds.includes(a.id);
            return (
              <div
                key={a.id}
                className={`flex items-start gap-3 rounded-md border p-3 ${
                  unlocked ? "border-accent/30 bg-accent/5" : "border-border-strong opacity-50"
                }`}
              >
                <span className="text-xl">{a.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">{a.title}</p>
                  <p className="text-xs text-text-secondary">{a.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
