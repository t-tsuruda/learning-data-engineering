/**
 * Gemini APIを使ったAI Mentor実装（Full Mode専用、server-side only）。
 * GEMINI_API_KEYが設定され、AI_MENTOR_MOCK=falseのときのみ使用される。
 * このファイルはRoute Handler等サーバー側からのみimportすること（APIキーをクライアントに渡さない）。
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiMentorProvider, MentorInteraction, MentorQuestContext, MentorResponse } from "./types";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";

export class GeminiAiMentorProvider implements AiMentorProvider {
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName = "gemini-2.0-flash") {
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  async respond(context: MentorQuestContext, interaction: MentorInteraction): Promise<MentorResponse> {
    const model = this.client.getGenerativeModel({
      model: this.modelName,
      systemInstruction: SYSTEM_PROMPT,
    });

    const prompt = buildUserPrompt(context, interaction);
    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();

    return { message, meta: { provider: "gemini", model: this.modelName } };
  }
}
