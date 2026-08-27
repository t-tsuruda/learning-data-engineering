import { NextResponse } from "next/server";
import { z } from "zod";
import { getAiMentorProvider } from "@/lib/ai";

const questContextSchema = z.object({
  questTitle: z.string(),
  questMission: z.string(),
  questType: z.string(),
  skills: z.array(z.string()),
  skillMastery: z.array(z.object({ skillId: z.string(), masteryScore: z.number() })),
  hintsUsedLevels: z.array(z.number()),
  attemptCount: z.number(),
  confidenceBefore: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
});

const interactionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("hint-request"), requestedLevel: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal("answer")]) }),
  z.object({ kind: z.literal("code-review"), code: z.string().max(4000) }),
  z.object({ kind: z.literal("reflection"), questionAnswer: z.string().max(2000) }),
  z.object({ kind: z.literal("free-question"), message: z.string().max(1000) }),
]);

const requestSchema = z.object({
  context: questContextSchema,
  interaction: interactionSchema,
});

/**
 * AI Mentorエンドポイント。dev-requirements-addendum.md §4.3の方針に従い、
 * 個人情報はcontextに含めない前提で受け取る。
 * Full Modeでのレート制限（Upstash Redis, 1ユーザー1日20回）はPhase 11でServer Action/middlewareに実装する。
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "リクエストの形式が正しくありません" } },
      { status: 400 },
    );
  }

  try {
    const provider = await getAiMentorProvider();
    const response = await provider.respond(parsed.data.context, parsed.data.interaction);
    return NextResponse.json({ message: response.message });
  } catch (err) {
    console.error("AI Mentor request failed", err);
    return NextResponse.json(
      {
        error: {
          code: "MENTOR_UNAVAILABLE",
          message: "Senior Engineerが少し席を外しています。少し時間を置いてもう一度試してみてください。",
        },
      },
      { status: 503 },
    );
  }
}
