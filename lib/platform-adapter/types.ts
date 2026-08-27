/**
 * Platform Adapter抽象化（dev-requirements-addendum.md §6.3）。
 * Quest実行ロジックはこのインターフェースにのみ依存し、DuckDB-Wasmの実装詳細に
 * 直接依存させない。将来 databricks-adapter.ts / snowflake-adapter.ts を追加する際、
 * Quest UI側の変更を最小限にするための抽象化（MVPではduckdbのみ実装）。
 */

export type PlatformAdapterRow = Record<string, unknown>;

export interface QueryResult {
  columns: string[];
  rows: PlatformAdapterRow[];
  /** クエリ実行にかかった時間(ms)。UIでの体感速度表示に使う */
  durationMs: number;
}

export interface QueryError {
  message: string;
}

export interface PlatformAdapter {
  /** アダプタを初期化する（Wasmバイナリのロード等）。複数回呼んでも安全（冪等）。 */
  init(): Promise<void>;
  /** 与えられたSQL（複数文可）でデータセットを準備し直す */
  reset(seedSql: string): Promise<void>;
  /** SQLを実行し、結果を返す。構文エラー等は例外ではなく戻り値のerrorで表現する */
  execute(sql: string): Promise<{ result?: QueryResult; error?: QueryError }>;
  listTables(): Promise<string[]>;
  getSchema(tableName: string): Promise<{ column: string; type: string }[]>;
  dispose(): Promise<void>;
}
