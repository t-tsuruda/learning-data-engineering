export const metadata = { title: "利用規約 | Data Engineer Quest" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-text-secondary sm:px-10">
      <h1 className="mb-6 text-xl font-semibold text-text-primary">利用規約</h1>

      <p className="mb-4 rounded-md border border-warning/30 bg-warning/5 p-3 text-xs text-warning">
        本ページはドラフトです。実際に公開する前に、内容を見直し、必要に応じて専門家のレビューを受けてください。
      </p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">1. 本サービスについて</h2>
      <p>
        Data Engineer Quest（以下「本サービス」）は、Data Engineeringに関する学習コンテンツを、実務を模したQuest形式で提供する学習用アプリケーションです。
      </p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">2. 免責事項</h2>
      <p>
        本サービスは学習目的で提供されるものであり、実際のDatabricks等の実行環境の操作を保証するものではありません。本サービスの利用によって得られる知識・スキルが、特定の就職・転職・資格取得を保証するものではありません。
      </p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">3. 禁止事項</h2>
      <p>本サービスの運営を妨げる行為、他の利用者に不利益を与える行為、法令に違反する行為を禁止します。</p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">4. サービスの変更・停止</h2>
      <p>運営上・技術上の理由により、事前の予告なく本サービスの内容を変更、または提供を停止する場合があります。</p>

      <h2 className="mt-8 mb-2 font-medium text-text-primary">5. 準拠法</h2>
      <p>本規約の解釈にあたっては、日本法を準拠法とします。</p>
    </div>
  );
}
