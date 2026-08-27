"use client";

import { useState } from "react";
import type { Quest } from "@/lib/quest/schema";
import { Button } from "@/components/ui/Button";

export function HintPanel({
  quest,
  revealedLevels,
  answerRevealed,
  onRevealHint,
  onRevealAnswer,
}: {
  quest: Quest;
  revealedLevels: number[];
  answerRevealed: boolean;
  onRevealHint: (level: number) => void;
  onRevealAnswer: () => void;
}) {
  const [confirmingAnswer, setConfirmingAnswer] = useState(false);
  const nextLevel = quest.hints.find((h) => !revealedLevels.includes(h.level))?.level;
  const allHintsUsed = revealedLevels.length >= quest.hints.length;

  return (
    <div className="rounded-lg border border-border bg-bg-panel p-4">
      <p className="mb-3 text-xs font-medium tracking-wide text-text-secondary uppercase">Hint</p>

      <div className="flex flex-col gap-2">
        {quest.hints
          .filter((h) => revealedLevels.includes(h.level))
          .map((h) => (
            <div key={h.level} className="rounded-md bg-bg-elevated p-3 text-sm text-text-primary">
              <span className="mb-1 block text-[11px] font-medium text-accent">Hint {h.level}</span>
              {h.text}
            </div>
          ))}

        {answerRevealed ? (
          <div className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-text-primary">
            <span className="mb-1 block text-[11px] font-medium text-warning">Answer</span>
            {quest.answer.explanation}
            {quest.answer.sql ? (
              <pre className="mt-2 overflow-x-auto rounded bg-bg-elevated p-2 font-mono text-xs">{quest.answer.sql}</pre>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {nextLevel ? (
          <Button variant="secondary" onClick={() => onRevealHint(nextLevel)}>
            Hint {nextLevel} を見る
          </Button>
        ) : null}
        {!answerRevealed && allHintsUsed ? (
          confirmingAnswer ? (
            <Button
              variant="secondary"
              onClick={() => {
                onRevealAnswer();
                setConfirmingAnswer(false);
              }}
            >
              答えを見る（失敗ではありません）
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmingAnswer(true)}>
              それでも分からない場合はこちら
            </Button>
          )
        ) : null}
      </div>

      {revealedLevels.length > 0 ? (
        <p className="mt-3 text-[11px] text-text-muted">
          ヒントを使うことはマイナスではありません。「助けを求めて解決できたこと」も成長として記録されます。
        </p>
      ) : null}
    </div>
  );
}
