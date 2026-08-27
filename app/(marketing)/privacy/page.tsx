export const metadata = { title: "プライバシーポリシー | Data Engineer Quest" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-text-secondary sm:px-10">
      <h1 className="mb-6 text-xl font-semibold text-text-primary">プライバシーポリシー</h1>

      <p className="mb-4 rounded-md border border-warning/30 bg-warning/5 p-3 text-xs text-warning">
        本ページはドラフトです。実際に公開する前に、実際の運用状況（利用サービス・データ保存先リージョン等）に合わせて内容を見直し、
        必要に応じて専門家のレビューを受けてください。
      </p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">1. 収集する情報</h2>
      <p>
        本サービス（Data Engineer Quest）は、以下の情報を取得する場合があります：アカウント情報（メールアドレス、表示名）、学習の進捗データ（Quest挑戦履歴、スキル習熟度、確信度の自己評価）、AI
        Mentorとのやり取りの内容。
      </p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">2. 利用目的</h2>
      <p>取得した情報は、本サービスの提供・学習体験のパーソナライズ・不具合対応・サービス改善のためにのみ利用します。</p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">3. 第三者への提供・外部サービスの利用</h2>
      <p>
        AI Mentor機能では、Quest内容・スキル習熟度などの情報（氏名・メールアドレス等の個人を特定する情報は含みません）をLLM提供事業者（Google
        Gemini API等）に送信します。認証・データベースにはSupabase、エラー監視にはSentry等の外部サービスを利用する場合があります。
      </p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">4. データの保存先</h2>
      <p>
        データは外部クラウドサービス（Supabase等）に保存されます。保存先リージョンによっては、日本国外へのデータ移転（越境移転）に該当する場合があります。
      </p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">5. Cookie等の利用</h2>
      <p>ログイン状態の維持のためにCookieを利用する場合があります。</p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">6. データの開示・削除請求</h2>
      <p>
        ご自身のデータの開示・訂正・削除を希望される場合は、Profile画面の機能、またはお問い合わせ窓口よりご連絡ください。個人情報保護法に基づき、合理的な範囲で対応します。
      </p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">7. 未成年の利用について</h2>
      <p>未成年の方がご利用になる場合は、保護者の同意のもとご利用ください。</p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">8. 改定</h2>
      <p>本ポリシーは、必要に応じて改定されることがあります。</p>
    </div>
  );
}
