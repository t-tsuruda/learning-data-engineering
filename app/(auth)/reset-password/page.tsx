"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/home");
    router.refresh();
  };

  return (
    <Card>
      <h1 className="mb-1 text-lg font-semibold text-text-primary">新しいパスワードを設定</h1>

      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-xs text-text-secondary" htmlFor="password">
            新しいパスワード
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
          {loading ? "更新中..." : "パスワードを更新"}
        </Button>
      </form>
    </Card>
  );
}
