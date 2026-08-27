"use client";

/**
 * Full Mode専用: アプリ本体のマウント時に一度だけサーバーから進捗を取得し、
 * Demo Modeと同じzustand storeへ流し込む。これにより既存のUI（Home/Skills/Progress/Profile等）を
 * 変更せずにFull Modeのデータで動かせる（docs/architecture.md §4.1）。
 */
import { useEffect, useRef } from "react";
import { getMyProgressSnapshotAction } from "@/app/(app)/actions";
import { useProgressStore } from "@/lib/state/progress-store";

export function FullModeSync() {
  const hydrateFromServer = useProgressStore((s) => s.hydrateFromServer);
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    getMyProgressSnapshotAction()
      .then((snapshot) => {
        if (snapshot) hydrateFromServer(snapshot);
      })
      .catch((err) => {
        console.error("Failed to load progress from server", err);
      });
  }, [hydrateFromServer]);

  return null;
}
