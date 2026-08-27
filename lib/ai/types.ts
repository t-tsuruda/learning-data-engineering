/**
 * AI Mentor（Senior Data Engineer）のプロバイダ抽象化（docs/architecture.md §8）。
 * Demo Modeでは常にMockProviderを使い、Full Mode + AI_MENTOR_MOCK=falseの場合のみ
 * 実LLM（Gemini）を呼び出す。
 */

export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export interface MentorQuestContext {
  questTitle: string;
  questMission: string;
  questType: string;
  skills: string[];
  /** そのユーザーの当該スキルの習熟度サマリ（個人情報は含めない） */
  skillMastery: { skillId: string; masteryScore: number }[];
  /** これまでに使用したヒントのレベル */
  hintsUsedLevels: number[];
  attemptCount: number;
  confidenceBefore?: ConfidenceLevel;
}

export type MentorInteraction =
  | { kind: "hint-request"; requestedLevel: 1 | 2 | 3 | "answer" }
  | { kind: "code-review"; code: string }
  | { kind: "reflection"; questionAnswer: string }
  | { kind: "free-question"; message: string };

export interface MentorResponse {
  message: string;
  /** 会話ログ保存用。個人情報を含めないこと（addendum §4.3） */
  meta?: Record<string, unknown>;
}

export interface AiMentorProvider {
  respond(context: MentorQuestContext, interaction: MentorInteraction): Promise<MentorResponse>;
}
