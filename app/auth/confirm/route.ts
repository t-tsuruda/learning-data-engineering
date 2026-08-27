import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

/**
 * サインアップ確認メール・パスワードリセットメールのリンク先（Full Mode専用）。
 * Supabaseダッシュボード側のメールテンプレートを
 * `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}` に変更する必要がある
 * （デフォルトテンプレートのままだとSupabaseホスト側のURLに飛ぶため）。
 * 手順はdocs/architecture.md §4.2を参照。
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/home";

  if (tokenHash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      const redirectTo = type === "recovery" ? "/reset-password" : next;
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=confirmation_failed", request.url));
}
