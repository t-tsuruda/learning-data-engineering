import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FullModeSync } from "@/components/layout/FullModeSync";
import { isSupabaseConfigured } from "@/lib/auth/config";
import { getCurrentUser } from "@/lib/auth/supabase-server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const fullMode = isSupabaseConfigured();
  const user = fullMode ? await getCurrentUser() : null;

  const authUser = user
    ? { email: user.email ?? "", emailConfirmed: Boolean(user.email_confirmed_at) }
    : null;

  return (
    <AppShell authUser={authUser}>
      {fullMode ? <FullModeSync /> : null}
      {children}
    </AppShell>
  );
}
