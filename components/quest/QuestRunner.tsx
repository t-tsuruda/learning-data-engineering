"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Quest } from "@/lib/quest/schema";
import { useSqlSandbox } from "@/lib/sql-sandbox/useSqlSandbox";
import { evaluateSqlSubmission } from "@/lib/sql-sandbox/evaluateSubmission";
import { compareChoice } from "@/lib/domain/grading";
import { useProgressStore } from "@/lib/state/progress-store";
import type { QuestCompletionResult } from "@/lib/domain/progress-engine";
import type { ConfidenceLevel } from "@/lib/domain/confidence";
import { getSkillDef } from "@/lib/domain/skills-catalog";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/domain/category-catalog";
import { ACHIEVEMENTS } from "@/lib/domain/achievements";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfidencePicker } from "@/components/quest/ConfidencePicker";
import { HintPanel } from "@/components/quest/HintPanel";
import { MentorPanel } from "@/components/quest/MentorPanel";
import { ResultTable } from "@/components/quest/ResultTable";
import { SqlEditor } from "@/components/quest/SqlEditor";
import type { QueryResult } from "@/lib/platform-adapter/types";

type Phase = "working" | "wrapup" | "summary";

const NOT_QUITE_MESSAGES = [
  "🔎 Interesting. そのアプローチだと、期待した結果にはならなかったようです。",
  "Not quite. でも、良い試みでした。もう一度データを見てみましょう。",
  "興味深い結果です。「なぜこうなったか」を確認してみましょう。",
];

export function QuestRunner({ quest, nextQuestId }: { quest: Quest; nextQuestId?: string }) {
  const isSqlQuest = quest.type !== "decision";
  const seedSql = useMemo(
    () => quest.dataset?.tables.map((t) => t.seedSql).join("\n") ?? "",
    [quest.dataset],
  );
  const sandbox = useSqlSandbox(seedSql);

  const completeQuest = useProgressStore((s) => s.completeQuest);

  const [phase, setPhase] = useState<Phase>("working");
  const [code, setCode] = useState(quest.starterSql ?? "");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [investigated, setInvestigated] = useState(!isSqlQuest);
  const [hintsRevealed, setHintsRevealed] = useState<number[]>([]);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [confidenceBefore, setConfidenceBefore] = useState<ConfidenceLevel | undefined>();
  const [confidenceAfter, setConfidenceAfter] = useState<ConfidenceLevel | undefined>();
  const [reflection, setReflection] = useState("");
  const [lastAttempt, setLastAttempt] = useState<{ passed: boolean; reason?: string; message?: string } | null>(null);
  const [preview, setPreview] = useState<{ table: string; result: QueryResult } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completion, setCompletion] = useState<QuestCompletionResult | null>(null);

  const hintsUsed = hintsRevealed.length + (answerRevealed ? 1 : 0);

  const handlePreview = async (table: string) => {
    setInvestigated(true);
    const { result } = await sandbox.run(`SELECT * FROM "${table}" LIMIT 5`);
    if (result) setPreview({ table, result });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setLastAttempt(null);
    const nextAttemptCount = attemptCount + 1;
    setAttemptCount(nextAttemptCount);

    if (quest.type === "decision") {
      if (!selectedOptionId) {
        setSubmitting(false);
        return;
      }
      const criteria = quest.successCriteria;
      const cmp = criteria.type === "choice" ? compareChoice(selectedOptionId, criteria.correctOptionIds) : { passed: false };
      setLastAttempt({ passed: cmp.passed, reason: "reason" in cmp ? cmp.reason : undefined });
      if (cmp.passed) setPhase("wrapup");
    } else {
      const result = await evaluateSqlSubmission(quest, code, {
        run: sandbox.run,
        resetToSeed: sandbox.resetToSeed,
      });
      setLastAttempt({ passed: result.passed, reason: result.reason });
      if (result.userResult) setPreview({ table: "実行結果", result: result.userResult });
      if (result.passed) setPhase("wrapup");
    }
    setSubmitting(false);
  };

  const handleFinishWrapup = () => {
    const result = completeQuest({
      questId: quest.id,
      questCategory: quest.category,
      skillIds: quest.skills,
      baseXp: quest.xp.base,
      attemptCount,
      hintsUsed,
      goodInvestigation: investigated,
      explainedWhy: reflection.trim().length > 0,
      confidenceBefore,
      confidenceAfter,
    });
    setCompletion(result);
    setPhase("summary");
  };

  if (phase === "summary" && completion) {
    return <SummaryScreen quest={quest} completion={completion} confidenceBefore={confidenceBefore} confidenceAfter={confidenceAfter} hintsUsed={hintsUsed} nextQuestId={nextQuestId} />;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <QuestBriefing quest={quest} />

      {phase === "working" ? (
        <>
          <div className="rounded-lg border border-border bg-bg-elevated p-4">
            <p className="font-mono text-xs whitespace-pre-wrap text-text-secondary">{quest.story.request}</p>
          </div>

          <Card>
            <p className="mb-2 text-sm text-text-primary">{quest.mission}</p>
            {confidenceBefore === undefined ? (
              <div className="mt-3">
                <ConfidencePicker label="始める前に：今この問題、どれくらい解けそうですか？（任意）" onChange={setConfidenceBefore} />
              </div>
            ) : null}
          </Card>

          {quest.dataset ? (
            <Card>
              <p className="mb-2 text-xs font-medium tracking-wide text-text-secondary uppercase">Available Resources</p>
              <div className="flex flex-wrap gap-2">
                {quest.dataset.tables.map((t) => (
                  <Button key={t.name} variant="secondary" onClick={() => handlePreview(t.name)}>
                    🔍 {t.name} を見る
                  </Button>
                ))}
              </div>
              {preview ? (
                <div className="mt-3">
                  <p className="mb-1 text-xs text-text-muted">{preview.table}</p>
                  <ResultTable result={preview.result} />
                </div>
              ) : null}
            </Card>
          ) : null}

          {quest.type === "decision" ? (
            <Card>
              <div className="flex flex-col gap-2">
                {quest.options?.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors ${
                      selectedOptionId === opt.id ? "border-accent bg-accent/5" : "border-border-strong hover:border-accent/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision-option"
                      className="mt-1"
                      checked={selectedOptionId === opt.id}
                      onChange={() => setSelectedOptionId(opt.id)}
                    />
                    <span className="text-text-primary">{opt.label}</span>
                  </label>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <p className="mb-2 text-xs font-medium tracking-wide text-text-secondary uppercase">SQL Editor</p>
              <SqlEditor value={code} onChange={setCode} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  disabled={sandbox.status !== "ready"}
                  onClick={async () => {
                    const { result, error } = await sandbox.run(code);
                    if (result) setPreview({ table: "実行結果", result });
                    if (error) setLastAttempt({ passed: false, reason: error.message });
                  }}
                >
                  ▶ Run
                </Button>
              </div>
              {sandbox.status === "loading" ? <p className="mt-2 text-xs text-text-muted">SQL実行環境を準備中...</p> : null}
              {sandbox.status === "error" ? (
                <p className="mt-2 text-xs text-danger">サンドボックスの初期化に失敗しました: {sandbox.errorMessage}</p>
              ) : null}
            </Card>
          )}

          {lastAttempt && !lastAttempt.passed ? (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm text-text-primary">
              <p className="mb-1 font-medium text-warning">
                {NOT_QUITE_MESSAGES[attemptCount % NOT_QUITE_MESSAGES.length]}
              </p>
              {lastAttempt.reason ? <p className="text-text-secondary">{lastAttempt.reason}</p> : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleSubmit} disabled={submitting || (quest.type !== "decision" && sandbox.status !== "ready")}>
              Submit
            </Button>
            <MentorPanel
              questContext={{
                questTitle: quest.title,
                questMission: quest.mission,
                questType: quest.type,
                skills: quest.skills,
                skillMastery: [],
                hintsUsedLevels: hintsRevealed,
                attemptCount,
                confidenceBefore,
              }}
              currentCode={quest.type !== "decision" ? code : undefined}
            />
          </div>

          <HintPanel
            quest={quest}
            revealedLevels={hintsRevealed}
            answerRevealed={answerRevealed}
            onRevealHint={(level) => setHintsRevealed((prev) => [...prev, level])}
            onRevealAnswer={() => setAnswerRevealed(true)}
          />
        </>
      ) : (
        <Card>
          <p className="mb-1 text-lg font-semibold text-success">クリアしました 🎉</p>
          <p className="mb-4 text-sm text-text-secondary">最後に少しだけ振り返りましょう。</p>

          <label className="mb-1 block text-xs font-medium text-text-secondary" htmlFor="reflection">
            {quest.reflectionPrompt}
          </label>
          <textarea
            id="reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={3}
            placeholder="一言でもOKです"
            className="mb-4 w-full rounded-md border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
          />

          <ConfidencePicker
            label="この問題、今なら一人で解けそうですか？"
            value={confidenceAfter}
            onChange={setConfidenceAfter}
          />

          <Button className="mt-5" onClick={handleFinishWrapup}>
            完了する
          </Button>
        </Card>
      )}
    </div>
  );
}

function QuestBriefing({ quest }: { quest: Quest }) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <Badge>{CATEGORY_META[quest.category].emoji} {CATEGORY_META[quest.category].label}</Badge>
        <Badge variant="accent">{DIFFICULTY_META[quest.difficulty].label}</Badge>
        <Badge>約{quest.estimatedMinutes}分</Badge>
      </div>
      <h1 className="text-xl font-semibold text-text-primary">{quest.title}</h1>
      <p className="mt-2 text-sm text-text-secondary">{quest.story.context}</p>
    </div>
  );
}

function SummaryScreen({
  quest,
  completion,
  confidenceBefore,
  confidenceAfter,
  hintsUsed,
  nextQuestId,
}: {
  quest: Quest;
  completion: QuestCompletionResult;
  confidenceBefore?: ConfidenceLevel;
  confidenceAfter?: ConfidenceLevel;
  hintsUsed: number;
  nextQuestId?: string;
}) {
  const confidenceScale = ["😰", "😕", "🙂", "😎", "🔥"];
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <p className="mb-1 text-xs font-medium tracking-wide text-success uppercase">Mission Complete</p>
        <h1 className="text-2xl font-semibold text-text-primary">{quest.title}</h1>
      </div>

      <Card>
        <p className="mb-3 text-xs font-medium tracking-wide text-text-secondary uppercase">You solved</p>
        <p className="mb-4 text-sm text-text-primary">{quest.mission}</p>

        {completion.xp ? (
          <div className="mb-4">
            <p className="mb-1 text-xs text-text-muted">獲得XP</p>
            <p className="text-lg font-semibold text-accent">+{completion.xp.total} XP</p>
          </div>
        ) : null}

        {completion.masteryDeltas.length > 0 ? (
          <div className="mb-4">
            <p className="mb-1 text-xs text-text-muted">Skills improved</p>
            <div className="flex flex-col gap-1">
              {completion.masteryDeltas.map((d) => (
                <div key={d.skillId} className="flex items-center justify-between text-sm">
                  <span className="text-text-primary">{getSkillDef(d.skillId).name}</span>
                  <span className="text-success">
                    {d.before}% → {d.after}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-text-secondary">You used</span>
          <span className="text-text-primary">Hint × {hintsUsed}</span>
        </div>

        {confidenceBefore || confidenceAfter ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Confidence</span>
            <span className="text-text-primary">
              {confidenceBefore ? confidenceScale[confidenceBefore - 1] : "―"} → {confidenceAfter ? confidenceScale[confidenceAfter - 1] : "―"}
            </span>
          </div>
        ) : null}
      </Card>

      {completion.newlyUnlockedAchievementIds.length > 0 ? (
        <Card>
          <p className="mb-2 text-xs font-medium tracking-wide text-text-secondary uppercase">Achievement Unlocked</p>
          <div className="flex flex-col gap-2">
            {completion.newlyUnlockedAchievementIds.map((id) => {
              const def = ACHIEVEMENTS.find((a) => a.id === id);
              if (!def) return null;
              return (
                <div key={id} className="flex items-center gap-2 text-sm text-text-primary">
                  <span className="text-lg">{def.emoji}</span>
                  <span className="font-medium">{def.title}</span>
                  <span className="text-text-secondary">{def.description}</span>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {nextQuestId ? (
          <Link href={`/quests/${nextQuestId}`}>
            <Button>Next Quest →</Button>
          </Link>
        ) : null}
        <Link href="/quests">
          <Button variant="secondary">Quest Mapに戻る</Button>
        </Link>
        <Link href="/home">
          <Button variant="ghost">Homeに戻る</Button>
        </Link>
      </div>
    </div>
  );
}
