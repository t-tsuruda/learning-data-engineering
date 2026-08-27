"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgressStore } from "@/lib/state/progress-store";
import { useHydrated } from "@/lib/state/useHydrated";
import { getLevelProgress } from "@/lib/domain/level";
import { getSkillDef } from "@/lib/domain/skills-catalog";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/domain/category-catalog";
import type { QuestSummary } from "@/lib/quest/loader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "こんばんは";
  if (hour < 12) return "おはようございます";
  if (hour < 18) return "こんにちは";
  return "こんばんは";
}

export function HomeView({ quests }: { quests: QuestSummary[] }) {
  const hydrated = useHydrated();
  const displayName = useProgressStore((s) => s.displayName);
  const onboarded = useProgressStore((s) => s.onboarded);
  const progress = useProgressStore((s) => s.progress);
  const questAttempts = useProgressStore((s) => s.questAttempts);
  const setDisplayName = useProgressStore((s) => s.setDisplayName);
  const completeOnboarding = useProgressStore((s) => s.completeOnboarding);

  if (!hydrated) {
    return <div className="text-sm text-text-muted">読み込み中...</div>;
  }

  if (!onboarded) {
    return <OnboardingCard onStart={(name) => { setDisplayName(name); completeOnboarding(); }} />;
  }

  const sortedQuests = [...quests].sort(
    (a, b) => DIFFICULTY_META[a.difficulty].order - DIFFICULTY_META[b.difficulty].order,
  );
  const nextQuest = sortedQuests.find((q) => !questAttempts[q.id]) ?? sortedQuests[0];
  const levelProgress = getLevelProgress(progress.totalXp);

  const growingSkills = Object.entries(progress.skills)
    .filter(([, stats]) => stats.masteryScore > 0)
    .sort((a, b) => b[1].masteryScore - a[1].masteryScore)
    .slice(0, 3);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          {greeting()}{displayName ? `、${displayName}さん` : ""}
        </h1>
        {progress.streak.currentStreak > 0 ? (
          <p className="mt-1 text-sm text-text-secondary">🔥 {progress.streak.currentStreak} day streak</p>
        ) : null}
      </div>

      {nextQuest ? (
        <Card>
          <p className="mb-2 text-xs font-medium tracking-wide text-accent uppercase">Today&apos;s Quest</p>
          <h2 className="text-lg font-semibold text-text-primary">{nextQuest.title}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{CATEGORY_META[nextQuest.category].emoji} {CATEGORY_META[nextQuest.category].label}</Badge>
            <Badge variant="accent">所要時間: 約{nextQuest.estimatedMinutes}分</Badge>
          </div>
          <Link href={`/quests/${nextQuest.id}`} className="mt-4 inline-block">
            <Button>Start Quest</Button>
          </Link>
        </Card>
      ) : null}

      <Card>
        <p className="mb-2 text-xs font-medium tracking-wide text-text-secondary uppercase">Your Journey</p>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium text-text-primary">
            {levelProgress.rank.emoji} {levelProgress.rank.label}
          </span>
          <span className="text-xs text-text-muted">{progress.totalXp} XP</span>
        </div>
        <ProgressBar value={levelProgress.progressToNext * 100} colorClassName="bg-accent" />
        {levelProgress.nextRank ? (
          <p className="mt-2 text-xs text-text-muted">次のランク: {levelProgress.nextRank.emoji} {levelProgress.nextRank.label}</p>
        ) : (
          <p className="mt-2 text-xs text-text-muted">最高ランクに到達しています</p>
        )}
      </Card>

      {growingSkills.length > 0 ? (
        <Card>
          <p className="mb-3 text-xs font-medium tracking-wide text-text-secondary uppercase">Recent Growth</p>
          <div className="flex flex-col gap-2">
            {growingSkills.map(([skillId, stats]) => (
              <div key={skillId} className="flex items-center justify-between text-sm">
                <span className="text-text-primary">{getSkillDef(skillId).name}</span>
                <span className="text-success">↑ {stats.masteryScore}%</span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Link href="/quests" className="text-sm text-accent hover:underline">
        すべてのQuestを見る →
      </Link>
    </div>
  );
}

function OnboardingCard({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <Card className="mx-auto max-w-lg">
      <p className="mb-1 text-xs font-medium tracking-wide text-accent uppercase">Welcome</p>
      <h1 className="text-xl font-semibold text-text-primary">Welcome to Data Engineer Quest.</h1>
      <p className="mt-3 text-sm text-text-secondary">
        You don&apos;t need to know everything.
        <br />
        Your first mission is waiting.
      </p>
      <label className="mt-6 block text-xs text-text-secondary" htmlFor="display-name">
        呼び方を教えてください（後からProfileで変更できます）
      </label>
      <input
        id="display-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="例: たくま"
        className="mt-2 w-full rounded-md border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
      />
      <Button className="mt-4 w-full" onClick={() => onStart(name.trim() || "Rookie")}>
        始める
      </Button>
    </Card>
  );
}
