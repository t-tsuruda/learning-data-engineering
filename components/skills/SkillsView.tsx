"use client";

import { useProgressStore } from "@/lib/state/progress-store";
import { useHydrated } from "@/lib/state/useHydrated";
import { SKILL_CATALOG, SKILL_CATEGORIES } from "@/lib/domain/skills-catalog";
import { masteryLabel } from "@/lib/domain/mastery";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function SkillsView() {
  const hydrated = useHydrated();
  const skills = useProgressStore((s) => s.progress.skills);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Skills</h1>
        <p className="mt-1 text-sm text-text-secondary">
          単純な正解率ではなく、初回正答・ヒント利用・再挑戦・振り返りなどを組み合わせたMastery Scoreです。
        </p>
      </div>

      {SKILL_CATEGORIES.map((category) => {
        const skillsInCategory = SKILL_CATALOG.filter((s) => s.category === category);
        return (
          <Card key={category}>
            <p className="mb-4 text-xs font-medium tracking-wide text-text-secondary uppercase">{category}</p>
            <div className="flex flex-col gap-4">
              {skillsInCategory.map((skill) => {
                const stats = hydrated ? skills[skill.id] : undefined;
                const score = stats?.masteryScore ?? 0;
                return (
                  <div key={skill.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-text-primary">{skill.name}</span>
                      <span className="text-xs text-text-muted">{score > 0 ? masteryLabel(score) : "未着手"}</span>
                    </div>
                    <ProgressBar
                      value={score}
                      colorClassName={score >= 80 ? "bg-success" : score >= 40 ? "bg-accent" : "bg-warning"}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
