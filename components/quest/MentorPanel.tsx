"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { MentorInteraction, MentorQuestContext } from "@/lib/ai/types";

interface ChatMessage {
  role: "user" | "mentor";
  text: string;
}

async function askMentor(context: MentorQuestContext, interaction: MentorInteraction): Promise<string> {
  const res = await fetch("/api/v1/mentor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context, interaction }),
  });
  const data = await res.json();
  if (!res.ok) {
    return data?.error?.message ?? "Senior Engineerが少し席を外しています。";
  }
  return data.message as string;
}

export function MentorPanel({
  questContext,
  currentCode,
  alwaysOpen = false,
  showHintShortcut = true,
}: {
  questContext: MentorQuestContext;
  currentCode?: string;
  alwaysOpen?: boolean;
  showHintShortcut?: boolean;
}) {
  const [open, setOpen] = useState(alwaysOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (interaction: MentorInteraction, userLabel: string) => {
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: userLabel }]);
    const reply = await askMentor(questContext, interaction);
    setMessages((m) => [...m, { role: "mentor", text: reply }]);
    setLoading(false);
  };

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        👨‍💻 Ask Mentor
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-bg-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-text-secondary uppercase">Senior Engineer</p>
        {alwaysOpen ? null : (
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-text-muted hover:text-text-primary">
            閉じる
          </button>
        )}
      </div>

      <div className="mb-3 flex max-h-64 flex-col gap-2 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-xs text-text-muted">困ったことがあれば、遠慮なく聞いてください。</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap rounded-md px-3 py-2 text-xs ${
                m.role === "user" ? "self-end bg-accent/10 text-text-primary" : "self-start bg-bg-elevated text-text-primary"
              }`}
            >
              {m.text}
            </div>
          ))
        )}
        {loading ? <p className="text-xs text-text-muted">Senior Engineerが考えています...</p> : null}
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        {showHintShortcut ? (
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => send({ kind: "hint-request", requestedLevel: 1 }, "方向性のヒントが欲しいです")}
          >
            方向性のヒントが欲しい
          </Button>
        ) : null}
        {currentCode ? (
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => send({ kind: "code-review", code: currentCode }, "このコードをレビューしてください")}
          >
            コードをレビューして
          </Button>
        ) : null}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || loading) return;
          const text = input.trim();
          setInput("");
          send({ kind: "free-question", message: text }, text);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力..."
          className="flex-1 rounded-md border border-border-strong bg-bg-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-accent"
        />
        <Button type="submit" disabled={loading}>
          送信
        </Button>
      </form>
    </div>
  );
}
