/**
 * Server Component / Server Action / Route Handler用のSupabaseクライアント（Full Mode専用）。
 * Cookieベースのセッション管理はSupabase Authの標準機構に従う
 * （dev-requirements-addendum.md §4.2）。セッションのリフレッシュはmiddleware.tsで行う。
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing).");
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Componentからの呼び出し時はCookie書き込み不可（読み取り専用）。
          // セッションのリフレッシュはmiddleware.tsが担うため無視してよい。
        }
      },
    },
  });
}

/** 現在ログイン中のユーザーを取得する。未ログインならnull。 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
