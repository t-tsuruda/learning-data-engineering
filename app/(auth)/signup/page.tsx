"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || "Rookie" },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <Card>
        <h1 className="mb-2 text-lg font-semibold text-text-primary">確認メールを送信しました</h1>
        <p className="text-sm text-text-secondary">
          {email} 宛に確認メールを送信しました。メール内のリンクをクリックして、登録を完了してください。
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-1 text-lg font-semibold text-text-primary">Welcome to Data Engineer Quest.</h1>
      <p className="mb-6 text-sm text-text-secondary">
        You don&apos;t need to know everything. Your first mission is waiting.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-xs text-text-secondary" htmlFor="display-name">
            呼び方
          </label>
          <input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="例: たくま"
            className="w-full rounded-md border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
          />
        </div>
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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
          />
          <p className="mt-1 text-[11px] text-text-muted">8文字以上</p>
        </div>

        {error ? <p className="text-xs text-danger">{error}</p> : null}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "登録中..." : "始める"}
        </Button>
      </form>

      <p className="mt-4 text-xs text-text-secondary">
        アカウントをお持ちの方は{" "}
        <Link href="/login" className="text-accent hover:underline">
          ログイン
        </Link>
      </p>
    </Card>
  );
}
