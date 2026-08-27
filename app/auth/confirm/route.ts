import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

/**
 * サインアップ確認メール・パスワードリセットメールのリンク先（Full Mode専用）。
 *
 * SupabaseのFree tierはカスタムSMTPを設定しない限りメールテンプレート（本文・リンク形式）を
 * 編集できない。そのためデフォルトのメールは常にSupabaseホスト側の検証エンドポイント
 * （{project}.supabase.co/auth/v1/verify）を経由し、検証後に `redirect_to`（=このルート、
 * signUp/resetPasswordForEmailのemailRedirectTo/redirectToで指定）へ `?code=...`（PKCE）
 * 付きでリダイレクトしてくる。このルートはその`code`をセッションに交換するのが主経路。
 *
 * `token_hash`+`type`によるOTP直接検証は、将来カスタムSMTP＋独自テンプレートに切り替えた場合の
 * ためのフォールバックとして残す。
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? (type === "recovery" ? "/reset-password" : "/home");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  const tokenHash = searchParams.get("token_hash");
  const emailOtpType = type as EmailOtpType | null;
  if (tokenHash && emailOtpType) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ type: emailOtpType, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=confirmation_failed", request.url));
}
