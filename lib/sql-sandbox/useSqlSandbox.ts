"use client";

/**
 * Quest画面から使うSQLサンドボックスのReact Hook。
 * DuckDB-Wasmの読み込み・初期化・データセットのリセットをまとめて扱う。
 * dev-requirements-addendum.md §13: 初期バンドルに含めないよう動的importする。
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { PlatformAdapter, QueryError, QueryResult } from "@/lib/platform-adapter/types";

export type SqlSandboxStatus = "idle" | "loading" | "ready" | "error";

export interface UseSqlSandboxResult {
  status: SqlSandboxStatus;
  errorMessage?: string;
  run: (sql: string) => Promise<{ result?: QueryResult; error?: QueryError }>;
  /** データセットを初期状態(seedSql実行直後)に戻す。採点前に呼び、公平な比較を保証する。 */
  resetToSeed: () => Promise<void>;
}

export function useSqlSandbox(seedSql: string): UseSqlSandboxResult {
  const adapterRef = useRef<PlatformAdapter | null>(null);
  const [status, setStatus] = useState<SqlSandboxStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setStatus("loading");
      setErrorMessage(undefined);

      const { DuckDbAdapter } = await import("@/lib/platform-adapter/duckdb-adapter");
      const adapter = new DuckDbAdapter();
      await adapter.init();
      await adapter.reset(seedSql);
      if (cancelled) {
        await adapter.dispose();
        return;
      }
      adapterRef.current = adapter;
      setStatus("ready");
    })().catch((err: unknown) => {
      if (cancelled) return;
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : String(err));
    });

    return () => {
      cancelled = true;
      const adapter = adapterRef.current;
      adapterRef.current = null;
      void adapter?.dispose();
    };
  }, [seedSql]);

  const run = useCallback(async (sql: string) => {
    if (!adapterRef.current) {
      return { error: { message: "サンドボックスの準備がまだ完了していません" } };
    }
    return adapterRef.current.execute(sql);
  }, []);

  const resetToSeed = useCallback(async () => {
    if (!adapterRef.current) return;
    await adapterRef.current.reset(seedSql);
  }, [seedSql]);

  return { status, errorMessage, run, resetToSeed };
}
