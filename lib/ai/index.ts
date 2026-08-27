import type { AiMentorProvider } from "./types";
import { MockAiMentorProvider } from "./mock-provider";

export * from "./types";

let cached: AiMentorProvider | null = null;

/**
 * AI_MENTOR_MOCK=true（既定）または GEMINI_API_KEY 未設定の場合はモックにフォールバックする。
 * これにより開発中・Demo ModeではLLM APIコストが一切発生しない。
 * server-onlyの想定（Route Handlerからのみ呼び出す）。
 */
export async function getAiMentorProvider(): Promise<AiMentorProvider> {
  if (cached) return cached;

  const mock = process.env.AI_MENTOR_MOCK !== "false";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!mock && apiKey) {
    const { GeminiAiMentorProvider } = await import("./gemini-provider");
    cached = new GeminiAiMentorProvider(apiKey);
  } else {
    cached = new MockAiMentorProvider();
  }

  return cached;
}
