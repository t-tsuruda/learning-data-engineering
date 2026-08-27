import { Card } from "@/components/ui/Card";
import { MentorPanel } from "@/components/quest/MentorPanel";

export default function MentorPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">👨‍💻 AI Mentor</h1>
        <p className="mt-1 text-sm text-text-secondary">
          あなたのSenior Data Engineerです。答えをすぐには教えません。一緒に考え、必要な分だけヒントを出します。
        </p>
      </div>

      <Card>
        <p className="text-sm text-text-secondary">
          Quest中は、画面下部の「Ask Mentor」からいつでも質問できます。ここでは、Quest以外の一般的な相談もできます。
        </p>
      </Card>

      <MentorPanel
        alwaysOpen
        showHintShortcut={false}
        questContext={{
          questTitle: "General",
          questMission: "",
          questType: "free-question",
          skills: [],
          skillMastery: [],
          hintsUsedLevels: [],
          attemptCount: 0,
        }}
      />
    </div>
  );
}
