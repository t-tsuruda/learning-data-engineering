"use client";

/**
 * DuckDB-Wasm実装のPlatformAdapter（ブラウザ内実行）。
 * dev-requirements-addendum.md §5, §5.1に従い、まずシングルスレッド版（MVP bundle）から使う。
 * ユーザーのSQLはユーザー自身のブラウザ内でのみ実行され、他ユーザー・サーバーに影響しない。
 *
 * このファイルは動的importでのみ読み込むこと（addendum §13: 初期バンドルに含めない）。
 */
import type * as DuckDBNamespace from "@duckdb/duckdb-wasm";
import type { PlatformAdapter, QueryError, QueryResult } from "./types";

type DuckDB = typeof DuckDBNamespace;

function splitStatements(sql: string): string[] {
  return sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export class DuckDbAdapter implements PlatformAdapter {
  private db: DuckDBNamespace.AsyncDuckDB | null = null;
  private conn: DuckDBNamespace.AsyncDuckDBConnection | null = null;
  private duckdb: DuckDB | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    const duckdb = await import("@duckdb/duckdb-wasm");
    this.duckdb = duckdb;

    // jsDelivr CDNには依存せず、public/duckdb（scripts/copy-vendor-assets.mjsでコピー）から
    // シングルスレッドの「eh」（例外処理対応）バンドルを自前ホスティングして読み込む。
    // 「mvp」バンドルは不正なSQLで低レベルなwasmエラーを投げてしまうため使わない（同スクリプトのコメント参照）。
    // SharedArrayBuffer/COOP/COEPは不要（マルチスレッド版のみ必要）。
    // importScripts(相対URL)はBlob worker内で解決できないブラウザがあるため、絶対URLにする
    const bundle: DuckDBNamespace.DuckDBBundle = {
      mainModule: new URL("/duckdb/duckdb-eh.wasm", window.location.origin).toString(),
      mainWorker: new URL("/duckdb/duckdb-browser-eh.worker.js", window.location.origin).toString(),
      pthreadWorker: null,
    };

    const workerUrl = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" }),
    );
    const worker = new Worker(workerUrl);
    const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(workerUrl);

    this.db = db;
    this.conn = await db.connect();
  }

  private getConn(): DuckDBNamespace.AsyncDuckDBConnection {
    if (!this.conn) throw new Error("DuckDbAdapter is not initialized. Call init() first.");
    return this.conn;
  }

  async reset(seedSql: string): Promise<void> {
    const conn = this.getConn();
    const existing = await this.listTables();
    for (const table of existing) {
      await conn.query(`DROP TABLE IF EXISTS "${table}"`);
    }
    for (const statement of splitStatements(seedSql)) {
      await conn.query(statement);
    }
  }

  async execute(sql: string): Promise<{ result?: QueryResult; error?: QueryError }> {
    const conn = this.getConn();
    const trimmed = sql.trim().replace(/;+\s*$/, "");
    if (!trimmed) {
      return { error: { message: "SQLが入力されていません" } };
    }

    const start = performance.now();
    try {
      const arrowResult = await conn.query(trimmed);
      const durationMs = performance.now() - start;
      const columns = arrowResult.schema.fields.map((f) => f.name);
      const rows: Record<string, unknown>[] = arrowResult.toArray().map((row) => {
        const obj: Record<string, unknown> = {};
        for (const col of columns) {
          obj[col] = row[col];
        }
        return obj;
      });
      return { result: { columns, rows, durationMs } };
    } catch (err) {
      return { error: { message: err instanceof Error ? err.message : String(err) } };
    }
  }

  async listTables(): Promise<string[]> {
    const conn = this.getConn();
    const result = await conn.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'main' ORDER BY table_name",
    );
    return result.toArray().map((row) => String(row.table_name));
  }

  async getSchema(tableName: string): Promise<{ column: string; type: string }[]> {
    const conn = this.getConn();
    const stmt = await conn.prepare(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ? ORDER BY ordinal_position",
    );
    const result = await stmt.query(tableName);
    await stmt.close();
    return result.toArray().map((row) => ({ column: String(row.column_name), type: String(row.data_type) }));
  }

  async dispose(): Promise<void> {
    await this.conn?.close();
    await this.db?.terminate();
    this.conn = null;
    this.db = null;
  }
}
