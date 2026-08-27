import Link from "next/link";
import { getAllQuests } from "@/lib/quest/loader";

export default function LandingPage() {
  const quests = getAllQuests();
  const firstQuest = quests.find((q) => q.difficulty === "tutorial") ?? quests[0];

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text-primary">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-sm font-semibold tracking-tight">⚔️ Data Engineer Quest</span>
        <Link href="/home" className="text-sm text-text-secondary hover:text-text-primary">
          アプリを開く →
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16 sm:px-10">
        <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">Data Engineer Quest</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Learn by solving.
          <br />
          Grow by doing.
        </h1>
        <p className="mt-6 max-w-xl text-base text-text-secondary sm:text-lg">
          データエンジニアリングを、「勉強」ではなく「実戦」から始めよう。
          <br />
          実際のData Engineeringの問題を解きながら、「自分にもできる」という感覚を少しずつ積み重ねていくQuest型学習アプリです。
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/quests/${firstQuest.id}`}
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-bg hover:bg-accent-strong"
          >
            Start Your First Quest
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center justify-center rounded-md border border-border-strong px-6 py-3 text-sm font-medium text-text-primary hover:border-accent/50"
          >
            アプリを見てみる
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <LandingStep emoji="🧩" title="事件・課題が発生" desc="実際の仕事のような状況から始まる。教材ではなく現場のシナリオ。" />
          <LandingStep emoji="🔍" title="自分で調べて、書いて、実行" desc="データを見て、SQLを書いて、その場で結果を確認する。" />
          <LandingStep emoji="📈" title="成長を実感する" desc="ヒント利用や振り返りも含めて、過去の自分と比べた成長が見える。" />
        </div>

        <p className="mt-16 text-xs text-text-muted">
          「何から勉強すればいいか分からない人へ。」実際の問題を解きながら、Data Engineerの仕事を知る。
          昨日できなかったことが、今日できる。
        </p>
      </main>

      <footer className="flex justify-center gap-4 px-6 py-6 text-xs text-text-muted sm:px-10">
        <Link href="/privacy" className="hover:text-text-secondary">プライバシーポリシー</Link>
        <Link href="/terms" className="hover:text-text-secondary">利用規約</Link>
      </footer>
    </div>
  );
}

function LandingStep({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-panel p-4">
      <div className="mb-2 text-2xl">{emoji}</div>
      <div className="mb-1 text-sm font-medium text-text-primary">{title}</div>
      <div className="text-xs text-text-secondary">{desc}</div>
    </div>
  );
}
