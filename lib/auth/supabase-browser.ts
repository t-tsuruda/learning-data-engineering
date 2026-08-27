"use client";

/**
 * Client Component用のSupabaseクライアント（Full Mode専用）。
 * Demo Modeでは呼び出されない想定。呼び出す前に isSupabaseConfigured() を確認すること。
 */
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing).");
  }
  return createBrowserClient(url, anonKey);
}
