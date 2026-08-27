# Data Engineer Quest

**Learn by solving. Grow by doing.**

データエンジニアリングを「勉強」ではなく「実戦」から始める、Quest型学習アプリ。詳細なプロダクトビジョンは [`docs/prd.md`](docs/prd.md)、技術・運用制約は [`docs/dev-requirements-addendum.md`](docs/dev-requirements-addendum.md)、確定した実装方針は [`docs/architecture.md`](docs/architecture.md) を参照してください。

## Demo Mode / Full Mode

このアプリは2つのモードで動作します（詳細は `docs/architecture.md` §4）。

- **Demo Mode（既定）**: `DATABASE_URL` 未設定の場合。認証・DBを使わず、進捗はブラウザの`localStorage`に保存されます。すぐに動作確認・デモができます。
- **Full Mode**: Supabaseプロジェクトを接続した本番運用モード。認証・DB永続化・AI Mentorの実LLM呼び出しが有効になります。

## クイックスタート（Demo Mode）

```bash
pnpm install       # postinstallでMonaco Editor / DuckDB-Wasmの静的アセットをpublic/へ自前ホスティング用にコピーします
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。Supabaseプロジェクトが無くても、SQL実行・Quest進行・XP/Mastery/Achievementはすべて動作します。

## スクリプト

```bash
pnpm dev              # 開発サーバー
pnpm build            # 本番ビルド
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm test             # Vitest（ドメインロジックのユニットテスト）
pnpm format           # Prettier
pnpm validate:quests  # content/quests/*.json をzodスキーマで検証

# Full Mode（Supabase接続後）用
pnpm db:generate      # Prisma Client生成
pnpm db:migrate       # ローカル/開発DBへマイグレーション適用
pnpm db:deploy        # 本番DBへマイグレーション適用
pnpm db:seed          # skills/achievementsマスタデータ投入
pnpm db:studio        # Prisma Studio
```

## Full Modeへの切り替え

1. Supabaseプロジェクトを作成し、Pooler接続文字列（`DATABASE_URL`）と直接接続文字列（`DIRECT_URL`）、API情報（`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`）を取得する
2. `.env.example` を `.env.local` にコピーし、値を設定する
3. `pnpm prisma migrate dev --name init` でテーブルを作成する
4. `pnpm prisma migrate dev --name enable_rls --create-only` で空のマイグレーションを作り、`prisma/rls-policies.sql` の内容をそこに貼り付けてから `pnpm prisma migrate dev` で適用する（RLSポリシー）
5. `pnpm db:seed` でskills/achievementsのマスタデータを投入する
6. Supabaseダッシュボード → Authentication → Email Templates で、Confirm signup / Reset password のリンクを
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}` に変更する
   （デフォルトのままだとSupabaseホスト側のURLに飛んでしまうため）
7. AI Mentorを実LLM（Gemini）で動かす場合は `AI_MENTOR_MOCK=false` と `GEMINI_API_KEY` を設定する
8. `pnpm dev` で起動し、`/signup` からアカウント作成 → 確認メールのリンクを開く → ログインして動作確認する

詳細な設計は `docs/architecture.md` §4, §8 を参照してください。認証（サインアップ・確認メール・パスワードリセット・ログアウト）は
`app/(auth)/`・`app/auth/`・`lib/auth/` に、DB永続化は `lib/db/prisma-repository.ts` + `app/(app)/actions.ts` に実装済みです。
実際のSupabaseプロジェクトが無い状態ではこれらのコードは動作確認できていないため、接続後に一通りの動作確認（サインアップ→Quest完了→ログアウト→再ログインで進捗が残っているか）を行ってください。

## ディレクトリ構成

```
app/                    Next.js App Router（(marketing)=公開ページ, (app)=アプリ本体）
components/              UIコンポーネント
lib/domain/              XP/Mastery/Streak/Achievement等の純粋関数（Demo/Full両モード共通）
lib/quest/                Questコンテンツのスキーマ・ローダー
lib/platform-adapter/    DuckDB-Wasmラッパー（Platform Adapter抽象化）
lib/sql-sandbox/          SQL実行・採点用React Hook
lib/ai/                    AI Mentor（mock / Gemini）
lib/db/                   Prisma Client（Full Mode）
lib/state/                 zustandストア（Demo Modeの永続化）
content/quests/*.json      Questコンテンツ本体
prisma/schema.prisma       Full Mode用DBスキーマ
docs/                       PRD・開発要件・アーキテクチャ設計
```

## 現在の実装状況

- Core UI（Home / Quest Map / Quest / Skills / Progress / AI Mentor / Profile）: 実装済み
- SQL実行環境（DuckDB-Wasm, ブラウザ内実行, 自前ホスティング）: 実装済み
- Quest engine（10 Quests, カテゴリ: SQL Fundamentals / Data Investigation / Data Modeling / ETL / Pipeline Debugging / Databricks Intro）: 実装済み。MVP目標の20〜30 Questに向けて追加コンテンツは今後拡充
- XP / Mastery / Streak / Confidence / Achievement: 実装済み（Demo Mode, localStorage）
- AI Mentor: モック応答で実装済み。Gemini API接続は`GEMINI_API_KEY`設定後に有効化可能
- 認証・DB永続化（Full Mode）・Vercelデプロイ: 未接続（Supabaseプロジェクト・Vercelアカウントが必要、要ユーザー承認）
- CSP（Content Security Policy）: 基本的なセキュリティヘッダーのみ設定済み。DuckDB-Wasm/Monaco Editorの動作要件を踏まえた詳細なCSPは今後追加
