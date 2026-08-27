"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?type=recovery`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <Card>
        <h1 className="mb-2 text-lg font-semibold text-text-primary">メールを確認してください</h1>
        <p className="text-sm text-text-secondary">
          {email} 宛にパスワード再設定用のリンクを送信しました（メールが届いている場合のみ）。
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-1 text-lg font-semibold text-text-primary">パスワードを忘れた場合</h1>
      <p className="mb-6 text-sm text-text-secondary">登録済みのメールアドレスに再設定リンクを送ります。</p>

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

        {error ? <p className="text-xs text-danger">{error}</p> : null}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "送信中..." : "再設定リンクを送る"}
        </Button>
      </form>

      <p className="mt-4 text-xs text-text-secondary">
        <Link href="/login" className="text-accent hover:underline">
          ログインに戻る
        </Link>
      </p>
    </Card>
  );
}
