"use client";

import { useState } from "react";
import { useProgressStore } from "@/lib/state/progress-store";
import { useHydrated } from "@/lib/state/useHydrated";
import { getLevelProgress } from "@/lib/domain/level";
import { getSkillDef } from "@/lib/domain/skills-catalog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const CAREER_BRIDGE_ITEMS = [
  "Databricks Associate認定の学習を始める",
  "Junior Data Engineerポジションへの応募を検討する",
  "小さなData Platformプロジェクトを個人で作ってみる",
  "学んだ内容をポートフォリオとしてまとめる",
];

export function ProfileView() {
  const hydrated = useHydrated();
  const displayName = useProgressStore((s) => s.displayName);
  const setDisplayName = useProgressStore((s) => s.setDisplayName);
  const progress = useProgressStore((s) => s.progress);
  const resetAll = useProgressStore((s) => s.resetAll);
  // nullの間は「未編集」を表し、表示にはstoreの値をそのまま使う（effectでの同期は行わない）
  const [nameDraftOverride, setNameDraftOverride] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!hydrated) return <div className="text-sm text-text-muted">読み込み中...</div>;

  const nameDraft = nameDraftOverride ?? displayName;

  const levelProgress = getLevelProgress(progress.totalXp);
  const clearedCount = progress.achievementStats.totalQuestsCleared;
  const strongSkills = Object.entries(progress.skills)
    .filter(([, s]) => s.masteryScore >= 60)
    .map(([id]) => getSkillDef(id).name);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Profile</h1>
      </div>

      <Card>
        <label className="mb-1 block text-xs font-medium text-text-secondary" htmlFor="profile-name">
          表示名
        </label>
        <div className="flex gap-2">
          <input
            id="profile-name"
            value={nameDraft}
            onChange={(e) => setNameDraftOverride(e.target.value)}
            className="flex-1 rounded-md border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
          />
          <Button variant="secondary" onClick={() => setDisplayName(nameDraft.trim() || "Rookie")}>
            保存
          </Button>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-xs font-medium tracking-wide text-text-secondary uppercase">My Data Engineering Portfolio</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Career Rank</span>
            <span className="text-text-primary">{levelProgress.rank.emoji} {levelProgress.rank.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Total XP</span>
            <span className="text-text-primary">{progress.totalXp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Completed Quests</span>
            <span className="text-text-primary">{clearedCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Strong Skills</span>
            <span className="text-right text-text-primary">{strongSkills.length > 0 ? strongSkills.join(", ") : "―"}</span>
          </div>
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-xs font-medium tracking-wide text-text-secondary uppercase">Career Bridge</p>
        <p className="mb-3 text-sm text-text-secondary">
          このアプリの目的は、アプリ内で強くなることではなく、現実世界に出ることです。次に検討できることの例です。
        </p>
        <ul className="flex flex-col gap-2 text-sm text-text-primary">
          {CAREER_BRIDGE_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span aria-hidden>□</span>
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <p className="mb-2 text-xs font-medium tracking-wide text-text-secondary uppercase">データの管理</p>
        <p className="mb-3 text-xs text-text-secondary">
          Demo Modeの進捗はこのブラウザのlocalStorageにのみ保存されています。他の端末には引き継がれません。
        </p>
        {confirmingReset ? (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                resetAll();
                setConfirmingReset(false);
              }}
            >
              本当にリセットする
            </Button>
            <Button variant="ghost" onClick={() => setConfirmingReset(false)}>
              キャンセル
            </Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setConfirmingReset(true)}>
            進捗をすべてリセット
          </Button>
        )}
      </Card>
    </div>
  );
}
