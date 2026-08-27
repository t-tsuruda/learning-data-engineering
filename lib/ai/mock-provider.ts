/**
 * AI Mentorのモック実装。LLM APIを一切呼び出さず、Quest content自体のhints/answerと
 * ルールベースのテンプレートで応答する（Demo Mode既定 / AI_MENTOR_MOCK=trueのFull Mode）。
 * ソクラテス式に「すぐ答えを言わない」姿勢（prd.md §9.2）をテンプレートでも再現する。
 */
import type { AiMentorProvider, MentorInteraction, MentorQuestContext, MentorResponse } from "./types";

const SOCRATIC_PROMPTS = [
  "なぜそう思いましたか？",
  "その仮説を確かめるには、何を見れば分かりそうですか？",
  "似たような状況を、前のQuestで経験しませんでしたか？",
];

function hintResponse(context: MentorQuestContext, level: 1 | 2 | 3 | "answer"): string {
  if (level === "answer") {
    return [
      "分かりました。一緒に答えを見てみましょう。",
      "",
      "これは失敗ではありません。答えを見て理解し、次に自分で再現できるようになることも立派な成長です。",
      "",
      "（Quest画面の Answer を開いてください）",
    ].join("\n");
  }

  const prefix =
    level === 1
      ? "まずは方向性から考えてみましょう。"
      : level === 2
        ? "もう少し具体的な観点で見てみましょう。"
        : "かなり具体的なヒントです。";

  return `${prefix}\n\n（Quest内のHint ${level}を確認してください。それでも詰まったら、遠慮なく次のヒントを聞いてください。ヒントを使うことはマイナスではありません。）`;
}

function codeReviewResponse(code: string): string {
  const notes: string[] = [];
  if (/select\s+\*/i.test(code)) {
    notes.push("SELECT * は動きますが、実務では必要なカラムだけを明示した方が、読みやすく・意図しないカラム変更の影響も受けにくくなります。");
  }
  if (!/where/i.test(code) && /from/i.test(code)) {
    notes.push("WHERE句が無いようです。想定しているデータ量によっては、絞り込み条件が必要かもしれません（今回のQuestでは不要な場合もあります）。");
  }
  if (/order\s+by/i.test(code) === false && /group\s+by/i.test(code)) {
    notes.push("GROUP BYの結果は、ORDER BYを付けないとDB実装によって順序が変わることがあります。");
  }
  if (notes.length === 0) {
    notes.push("正しく動きそうです。可読性・保守性の面でも大きな問題は見当たりません。");
  }

  return [
    "Code Reviewです。",
    "",
    ...notes.map((n) => `- ${n}`),
    "",
    "実務ではこの後、実行計画（EXPLAIN）でパフォーマンスも確認する習慣をつけると良いです。",
  ].join("\n");
}

function reflectionResponse(context: MentorQuestContext, answer: string): string {
  const engaged = answer.trim().length >= 10;
  const base = engaged
    ? "しっかり考えて言語化できていますね。"
    : "一言でも、自分の言葉で理由を書いてみる習慣が力になります。";
  return [
    base,
    "",
    `${context.questTitle} で使った考え方は、今後別のQuestでも形を変えて出てきます。`,
    "実務ではさらに、コストや保守性の観点も加えて判断することが多いです。",
  ].join("\n");
}

function freeQuestionResponse(): string {
  const q = SOCRATIC_PROMPTS[Math.floor(Math.random() * SOCRATIC_PROMPTS.length)];
  return `いい質問ですね。${q}`;
}

export class MockAiMentorProvider implements AiMentorProvider {
  async respond(context: MentorQuestContext, interaction: MentorInteraction): Promise<MentorResponse> {
    switch (interaction.kind) {
      case "hint-request":
        return { message: hintResponse(context, interaction.requestedLevel), meta: { mock: true } };
      case "code-review":
        return { message: codeReviewResponse(interaction.code), meta: { mock: true } };
      case "reflection":
        return { message: reflectionResponse(context, interaction.questionAnswer), meta: { mock: true } };
      case "free-question":
        return { message: freeQuestionResponse(), meta: { mock: true } };
    }
  }
}
