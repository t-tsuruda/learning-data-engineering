# Data Engineer Quest — Architecture

このドキュメントは `prd.md`（プロダクトビジョン）と `dev-requirements-addendum.md`（技術・運用制約）を踏まえて確定した実装方針を記録する。実装中に方針を変更した場合は本ドキュメントを更新し、大きな判断は `docs/decisions/` にADRとして残す。

---

## 1. Core User Journey（要約）

```
Landing → 最初のQuest（易しい・成功体験） → Clear → XP/Skill Unlock
→ Quest Map で次のQuestを選ぶ → Quest（Context→Investigate→Attempt→Feedback→Reflection）
→ Mastery/Confidence記録 → Home（Streak, Continue） → … → Boss Quest → Graduate
```

学習の基本ループは常に `MISSION → CONTEXT → CHALLENGE → ATTEMPT → FEEDBACK → REFLECTION → MASTERY → NEXT QUEST`。

## 2. MVP Scope（確定）

Core: Auth, Home, Quest Map, Quest, SQL Editor/Execution, Hint(3段階+Answer), AI Mentor(mock優先), XP, Level, Skill, Mastery, Progress, Streak, Confidence, Quest completion。

MVP外: Social/Leaderboard, Mobile App, Multiplayer, Marketplace, 課金, 高度AI Agent, Databricks/Snowflake実接続。

---

## 3. 技術スタック（確定）

```
Frontend    : Next.js (App Router) + TypeScript + Tailwind CSS
State       : React Server Components基本。クライアント状態はzustand（軽量）
Backend     : Next.js Route Handlers / Server Actions
DB          : PostgreSQL (Supabase) — Prisma ORM
Auth        : Supabase Auth（Email/Password, Google OAuth任意）
SQL実行     : DuckDB-Wasm（シングルスレッド版から開始, §7参照）
Editor      : Monaco Editor（動的import）
AI          : Gemini API（無料枠）。サーバー側Route Handler経由、mockモード既定
Deployment  : Vercel
Package Mgr : pnpm
Node        : 22.x（.nvmrcで固定）
Rate Limit  : Upstash Redis（本番）。Demo Modeでは不要
```

理由：addendum §2の確定方針をそのまま採用。無料枠制約・実装容易性・エコシステム成熟度の観点で変更の必要なし。

---

## 4. Demo Mode / Full Mode（このプロジェクト固有の重要な設計判断）

**背景**: 開発サンドボックスにDockerが無くローカルSupabaseを起動できない。ユーザーとの合意により、MVP実装は「外部Supabaseプロジェクトを接続するまではモック/ローカル状態で進める」方針とした（今後Supabaseプロジェクトが提供された時点でFull Modeに切り替える）。

このプロジェクトでは最初から **2つの動作モード** を持つ設計にする。これは「やっつけのモック」ではなく、正式なアーキテクチャ上の抽象化として設計する（extensibility要件にも合致）。

```
Demo Mode（既定・DATABASE_URL未設定時）
  - 認証: ブラウザ内のローカルProfile（Supabase Authを模した最小限のセッション）
  - 永続化: localStorage（zustand persist）
  - AI Mentor: モック応答（ルールベース + テンプレート）
  - 用途: このセッションでの開発・動作確認、デモ公開、初回体験

Full Mode（DATABASE_URL / SUPABASE_* / GEMINI_API_KEY 設定時）
  - 認証: Supabase Auth（RLS適用）
  - 永続化: PostgreSQL（Prisma経由）
  - AI Mentor: Gemini API
  - 用途: 本番運用
```

### 4.1 実現方法：Repository抽象化

`lib/db/repository.ts` にドメインリポジトリのインターフェースを定義し、Server Actionsはこのインターフェースにのみ依存する。

```ts
interface ProgressRepository {
  getProfile(userId: string): Promise<Profile>
  recordAttempt(input: RecordAttemptInput): Promise<AttemptResult>
  getUserSkills(userId: string): Promise<UserSkill[]>
  ...
}
```

- `lib/db/prisma-repository.ts`: Prisma実装（Full Mode）
- Demo Modeはサーバー側リポジトリを使わず、**クライアント側の`useProgressStore`（zustand + persist）が同じドメインロジック（`lib/domain/`のXP計算・Mastery計算等）を直接呼び出す**。Server Actionsを経由しない。
- どちらのモードでも `lib/domain/` の純粋関数（XP計算・Mastery計算・Streak判定など）を共通利用するため、ロジックの二重実装は発生しない。

この設計により、Full Mode移行時にUIコンポーネントや採点ロジックを変更する必要がない（Server Actions実装 + Supabaseプロジェクト接続のみで移行可能）。

### 4.2 Full Modeへの移行手順（将来Supabase接続時）

1. Supabaseプロジェクトを作成し、Pooler URL / Direct URLを取得
2. `.env.local`に`DATABASE_URL`（Pooler経由）、`DIRECT_URL`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`を設定
3. `pnpm prisma migrate deploy`
4. `lib/db/index.ts`の`getRepository()`が`DATABASE_URL`の有無で自動的にPrisma実装を返すようになる（実装済み・切替コード不要）
5. Supabase AuthのRLSポリシーを適用（`prisma/migrations`内のSQLに含む）

---

## 5. Database Schema（Prisma / PostgreSQL）

`prd.md §68`のテーブル一覧を土台に設計。全テーブル共通: `id uuid PK`, `created_at`, `updated_at`。

```
users                 -- Supabase Authのuser.idをそのまま外部キーとして使用
profiles              -- 表示名, career_rank, onboarding状態
skills                -- スキルマスタ（sql, data-modeling, etl, spark, databricks, architecture ...）
user_skills           -- user_id, skill_id, mastery_score(0-100), 内訳(first_try/hint_used/retry/...)
quest_attempts        -- user_id, quest_id(content側のid), status, hints_used, attempt_count,
                          started_at, completed_at, confidence_before, confidence_after, idempotency_key
quest_hints           -- attempt_id, hint_level(1-3+answer), revealed_at
achievements          -- バッジマスタ
user_achievements     -- user_id, achievement_id, achieved_at
streaks               -- user_id, current_streak, longest_streak, last_active_date(JST基準の日付)
daily_quests          -- user_id, date(JST), quest_id, completed
ai_conversations      -- user_id, quest_id, messages(jsonb), created_at（90日で削除バッチ想定）
confidence_records    -- user_id, skill_id, quest_id, level(1-5 絵文字スケール), recorded_at
```

規約:

- 外部キー制約を必ず張る。`user_id`, `quest_id`, `skill_id`にインデックス。
- マイグレーションはPrisma Migrateのみで変更（ダッシュボード手動編集禁止）。
- 冪等性: `quest_attempts`の報酬確定操作は`idempotency_key`（クライアント発行のUUID）で二重付与防止。
- RLS: 全テーブルで `auth.uid() = user_id` （または`users`経由）を必須とし、Server Actions側でも所有者チェックを二重に行う（多層防御）。
- タイムゾーン: DB保存はUTC。Daily Quest/Streak判定のみJST(UTC+9)に変換して計算する `lib/domain/datetime.ts` を共通利用。

Prismaファイルは`prisma/schema.prisma`に実装済み（Full Mode用。Demo Modeでは未接続でも`pnpm typecheck`が通るようスキーマのみ用意し、クライアントは遅延生成）。

---

## 6. Quest Data Model

`content/quests/*.json` で管理（DBではない。addendum §3.1）。ビルド時にzodスキーマでバリデーションし、不正なQuestがあればビルドを失敗させる。

```jsonc
{
  "id": "quest-001",
  "title": "Sales Dashboardがおかしい",
  "category": "data-investigation",
  "difficulty": "tutorial", // tutorial|easy|normal|hard|expert|boss
  "platform": "duckdb",     // 将来: databricks | snowflake
  "skills": ["sql-select", "data-investigation"],
  "estimatedMinutes": 8,
  "type": "investigation",  // investigation | sql-fix | sql-write | decision | design
  "story": { "context": "...", "request": "...(Slack/Ticket風)" },
  "mission": "...",
  "dataset": { "tables": [ { "name": "sales", "seedSql": "CREATE TABLE ...; INSERT ..." } ] },
  "hints": [
    { "level": 1, "text": "..." },
    { "level": 2, "text": "..." },
    { "level": 3, "text": "..." }
  ],
  "answer": { "explanation": "...", "sql": "SELECT ..." },
  "successCriteria": { "type": "sql-result-match", "expectedRowsSql": "SELECT ..." },
  "reflectionPrompt": "なぜこの設計を選びましたか？",
  "xp": { "base": 100, "firstAttempt": 50, "goodInvestigation": 30, "explainedWhy": 40 }
}
```

`lib/quest/schema.ts`（zod）で型定義し、`lib/quest/loader.ts`がビルド/起動時に全ファイルをパースする。Contentとロジックは完全分離（addendum §70）。

---

## 7. SQL実行環境 / Platform Adapter

- DuckDB-Wasm **シングルスレッドの「eh」（例外処理対応）バンドル** を採用（addendum §5.1推奨の「まずシングルスレッド版から」に従う）。`lib/platform-adapter/duckdb-adapter.ts`で`eh`バンドルを明示的に選択しており、`SharedArrayBuffer`を必要としないためCOOP/COEPヘッダーは不要。
  - 当初は最小構成の「mvp」バンドルを検討したが、実機検証で不正なSQL入力時に`_setThrew is not defined`という低レベルなWasmエラーが発生し、「失敗を罰しない／正しいエラーメッセージを見せる」というQuestのUX要件（prd.md §11, §46）を満たせないことが判明したため、Wasm例外処理に対応した「eh」バンドルに切り替えた。「eh」もシングルスレッドでCOOP/COEP不要な点は「mvp」と同じ。
  - jsDelivr CDNには依存せず、`node_modules/@duckdb/duckdb-wasm/dist`の該当ファイルを`scripts/copy-vendor-assets.mjs`（`pnpm install`時に`postinstall`で自動実行）で`public/duckdb/`へコピーして自前ホスティングする。CDNへのアクセスを許可しないネットワーク環境でも動作させるため。Monaco Editorも同様の理由で`public/vs/`に自前ホスティングする（`node_modules/monaco-editor/min/vs`をコピー）。
- パフォーマンス上の必要が出た場合のみ、マルチスレッド版（coi bundle）+ COOP/COEPヘッダー（`next.config.ts`に追加）への移行を検討する。外部埋め込みスクリプトやOAuthポップアップとの衝突リスクがあるため、必要になるまでは追加しない（Do not overengineer, prd.md §82）。
- `lib/platform-adapter/types.ts` に `PlatformAdapter`（`execute(sql)`, `listTables()`, `getSchema()`, `reset(seedSql)`）を定義。
- `lib/platform-adapter/duckdb-adapter.ts` がMVP実装。将来 `databricks-adapter.ts` / `snowflake-adapter.ts` を追加。
- 採点（XP/Mastery更新）は**クライアント実行結果をそのまま信頼しない**方針を将来のFull Modeで適用する。Demo Modeでは全てクライアント内で完結するため、この検証はFull Mode移行時にServer Action側へ実装する（`lib/domain/grading.ts`は共通ロジックとして両モードから呼べる形にしておく）。

---

## 8. AI Mentor Architecture

```
lib/ai/
├── types.ts          # AiMentorProvider interface: getHint(), reviewCode(), reflect()
├── mock-provider.ts  # ルールベース応答（開発既定・Demo Mode既定）
├── gemini-provider.ts# Gemini API実装（Full Mode, GEMINI_API_KEY設定時）
└── prompt.ts          # システムプロンプト・段階的支援レベルの構築
```

- Tutor Modeの段階（prd.md §72）: `Level1 Question → Level2 Hint → Level3 Explanation → Level4 Example → Level5 Answer`。ユーザーが明示的に要求した場合のみAnswerを出す。
- Contextとして渡す情報（prd.md §71）: Current Quest, Current Attempt, User Skills/Mastery, Hint History, Confidence, （直近のQuest履歴の要約）。氏名・メールアドレス等の個人情報は含めない。
- プロンプトインジェクション対策: Quest本文・ユーザー入力は`<user_input>`のように明確に区切り、システム指示を上書きできない設計にする。
- レート制限・予算: Full Modeでは1ユーザー1日20回を既定上限とし、Upstash Redisでカウント（TTL=JST日次リセット）。上限到達時は「Senior Engineerが少し席を外しています」という世界観に沿ったフォールバックを表示（機能停止ではなく静的ヒント集に切替）。Demo Modeではこの制限は不要（AI呼び出し自体が発生しないため）。
- ストリーミング応答はFull Mode実装時にVercel AI SDK等で対応（Demo Modeのモックは疑似ストリーミングでUXを揃える）。

---

## 9. 無料枠と上限到達時の挙動（一覧）

| サービス | 無料枠目安 | 上限到達時の挙動 |
|---|---|---|
| Vercel Hobby | 個人利用無料、商用利用不可規約に注意 | 帯域超過時はVercelダッシュボードで確認・Proへの移行を検討（コードでの自動対応は不可） |
| Supabase Free | DB 500MB、非活動時Pause | 定期ping（GitHub Actions cron）でPause回避を検討。容量超過は古いai_conversations等をバッチ削除 |
| DuckDB-Wasm | サーバーコスト0（ブラウザ内実行） | 該当なし |
| GitHub Actions | Public/Privateで無料枠あり | CIのE2Eは主要導線のみに絞り消費を抑制 |
| Sentry Free | イベント数上限 | 上限到達で新規イベント破棄、既存ログのみ参照 |
| Upstash Redis Free | コマンド数/月上限 | 上限到達時はレート制限をfail-closed（AI Mentor呼び出しを一時停止しモック応答にフォールバック） |
| Resend Free | 送信数/日上限 | 上限到達時は認証メール送信を待機キューに置き、ユーザーに時間を置いた再送内を案内 |
| Gemini API Free | レート制限あり(RPM/RPD) | 上限到達時はAI Mentorをモック応答にフォールバックし、「Senior Engineerが少し席を外しています」を表示 |

---

## 10. ディレクトリ構成

```
/
├── app/                        # Next.js App Router
│   ├── (marketing)/            # Landing
│   ├── (app)/                  # 認証後アプリ本体: home, quests, skills, progress, mentor, profile
│   └── api/v1/                 # Route Handlers
├── components/
├── lib/
│   ├── domain/                 # XP/Mastery/Streak/Confidence等の純粋関数（両モード共通）
│   ├── db/                     # Prisma repository実装 + getRepository()
│   ├── ai/                     # AI Mentor adapter
│   ├── sql-sandbox/            # DuckDB-Wasm実行ラッパー
│   ├── platform-adapter/
│   ├── quest/                  # Quest schema/loader
│   └── auth/
├── content/quests/*.json
├── prisma/schema.prisma
├── tests/{unit,e2e}
├── docs/{architecture.md, decisions/}
├── .env.example
└── .nvmrc
```

---

## 11. Development Process（Phase計画）

`prd.md §79`に準拠。各Phase終了時にlint/typecheck/test/buildを実施し、壊れた状態を次に持ち越さない。Phase 11（Auth/DB実接続・デプロイ）はSupabaseプロジェクト・Gemini API Key・Vercelアカウントの提供を受けてから着手する（要ユーザー承認）。

## 12. ブラウザサポート

Chrome/Edge/Firefox/Safariの直近2メジャーバージョン。非対応環境は「対応ブラウザでアクセスしてください」の案内を表示する。
