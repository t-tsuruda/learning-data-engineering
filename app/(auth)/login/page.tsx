"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <Suspense fallback={<Card>読み込み中...</Card>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(
        signInError.message.includes("Invalid login credentials")
          ? "メールアドレスまたはパスワードが正しくありません"
          : signInError.message,
      );
      setLoading(false);
      return;
    }

    const next = searchParams.get("next") ?? "/home";
    router.push(next);
    router.refresh();
  };

  return (
    <Card>
      <h1 className="mb-1 text-lg font-semibold text-text-primary">おかえりなさい</h1>
      <p className="mb-6 text-sm text-text-secondary">前回のQuestから続けましょう。</p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-xs text-text-secondary" htmlFor="email">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary" htmlFor="password">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
          />
        </div>

        {error ? <p className="text-xs text-danger">{error}</p> : null}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-1 text-xs text-text-secondary">
        <Link href="/forgot-password" className="hover:text-text-primary">
          パスワードを忘れた場合
        </Link>
        <span>
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-accent hover:underline">
            新規登録
          </Link>
        </span>
      </div>
    </Card>
  );
}
