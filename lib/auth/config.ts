/**
 * Full Mode判定（docs/architecture.md §4）。
 * NEXT_PUBLIC_SUPABASE_URL はビルド時に静的に埋め込まれるため、クライアント側でも
 * Demo Mode / Full Modeの分岐に使える（サーバー専用のDATABASE_URLはクライアントから見えない）。
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
