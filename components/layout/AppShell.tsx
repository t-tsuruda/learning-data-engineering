"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/home", label: "Home", emoji: "🏠" },
  { href: "/quests", label: "Quest Map", emoji: "🗺️" },
  { href: "/skills", label: "Skills", emoji: "🧠" },
  { href: "/progress", label: "Progress", emoji: "📊" },
  { href: "/mentor", label: "AI Mentor", emoji: "👨‍💻" },
  { href: "/profile", label: "Profile", emoji: "👤" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-bg-elevated sm:flex sm:flex-col">
        <Link href="/home" className="flex items-center gap-2 px-5 py-5 text-sm font-semibold tracking-tight text-text-primary">
          <span aria-hidden>⚔️</span>
          <span>Data Engineer Quest</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:bg-bg-panel-hover hover:text-text-primary"
                }`}
              >
                <span aria-hidden>{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 text-xs text-text-muted">Demo Mode（ローカル保存）</div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-bg-elevated px-4 py-3 sm:hidden">
          <Link href="/home" className="text-sm font-semibold text-text-primary">
            ⚔️ Data Engineer Quest
          </Link>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        <nav className="flex items-center justify-around border-t border-border bg-bg-elevated px-2 py-2 sm:hidden">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-[11px] ${
                  active ? "text-accent" : "text-text-secondary"
                }`}
              >
                <span aria-hidden className="text-base">{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
