/**
 * Monaco EditorとDuckDB-Wasmの静的アセットをnode_modulesからpublic/へコピーする。
 *
 * 理由: @monaco-editor/reactはデフォルトでjsDelivr CDNからMonacoを読み込み、
 * duckdb-wasmもデフォルトでjsDelivr CDNからWasm/Workerを読み込む。
 * 外部CDNへの依存はネットワークポリシーの厳しい環境（社内ネットワーク、CSP制限、
 * 本サンドボックス等）で失敗しうるため、MVPでは両方とも自前ホスティングする
 * （lib/platform-adapter/duckdb-adapter.ts, components/quest/SqlEditor.tsx参照）。
 *
 * `pnpm install` 実行時に自動実行される（package.json postinstall）。
 */
import { cpSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function copyDir(from, to) {
  if (!existsSync(from)) {
    console.warn(`[copy-vendor-assets] skip (not found): ${from}`);
    return;
  }
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[copy-vendor-assets] ${path.relative(rootDir, from)} -> ${path.relative(rootDir, to)}`);
}

// Monaco Editor: AMD loaderごと自前ホスティングする（public/vs）
copyDir(
  path.join(rootDir, "node_modules/monaco-editor/min/vs"),
  path.join(rootDir, "public/vs"),
);

// DuckDB-Wasm: シングルスレッドだが例外処理に対応した「eh」バンドルを自前ホスティングする（public/duckdb）。
// 「mvp」バンドルは不正なSQLで低レベルなwasmエラー(_setThrew is not defined等)を投げてしまい、
// Questの「失敗を罰しない」UX（正しいエラーメッセージを見せる）を満たせないため使わない。
// 「eh」はWasm例外処理を使うがSharedArrayBuffer/COOP/COEPは不要（マルチスレッド版のみ必要）。
mkdirSync(path.join(rootDir, "public/duckdb"), { recursive: true });
for (const file of ["duckdb-eh.wasm", "duckdb-browser-eh.worker.js"]) {
  copyDir(
    path.join(rootDir, "node_modules/@duckdb/duckdb-wasm/dist", file),
    path.join(rootDir, "public/duckdb", file),
  );
}
