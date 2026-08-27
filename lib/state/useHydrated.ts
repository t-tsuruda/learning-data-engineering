"use client";

/**
 * zustand persistのハイドレーション完了を検知するhook。
 * useEffect内で直接setStateする代わりにuseSyncExternalStoreで購読する
 * （SSRとlocalStorage復元後の状態のズレを、cascading re-renderなしに扱う）。
 */
import { useSyncExternalStore } from "react";
import { useProgressStore } from "./progress-store";

export function useHydrated(): boolean {
  return useSyncExternalStore(
    (callback) => useProgressStore.persist.onFinishHydration(callback),
    () => useProgressStore.persist.hasHydrated(),
    () => false,
  );
}
