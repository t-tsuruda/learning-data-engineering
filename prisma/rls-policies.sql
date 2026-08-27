-- Data Engineer Quest — Row Level Security policies (Full Mode)
--
-- 適用手順（実際のSupabaseプロジェクトに接続できるようになってから実行する）:
--   1. pnpm prisma migrate dev --name init            (schema.prismaからテーブルを作成)
--   2. pnpm prisma migrate dev --name enable_rls --create-only
--      で作られる空のmigration.sqlに、このファイルの内容を貼り付ける
--   3. pnpm prisma migrate dev                         (RLSマイグレーションを適用)
--   4. 本番へは pnpm db:deploy で反映する
--
-- 重要な設計上の注意（docs/architecture.md参照）:
-- このアプリはSupabaseのData API(PostgREST)をブラウザから直接叩く構成を取っていない。
-- 認証後のデータアクセスはすべてNext.jsのServer Actions経由で行い、Server Action側で
-- 必ず「セッションから取得したuser.idのみ」を使う（クライアントから渡されたuser_idは信用しない）。
-- これがdev-requirements-addendum.md §4.2.5が求める「多層防御」のアプリケーション層側。
--
-- 一方、Prismaはpostgres実行ユーザー(通常テーブルオーナー)としてDBに接続するため、
-- デフォルトではRLSはPrisma自身のクエリをブロックしない(テーブルオーナー/スーパーユーザーは
-- RLSをバイパスする)。したがってこのRLSは主に「将来Supabase Data APIを誤って有効化した場合」や
-- 「将来ブラウザから直接Supabaseクライアントでテーブルを叩くコードが追加された場合」に効く
-- 防御層として位置づける。要求仕様通りRLSは必ず設定する。

alter table profiles enable row level security;
alter table user_skills enable row level security;
alter table quest_attempts enable row level security;
alter table quest_hints enable row level security;
alter table user_achievements enable row level security;
alter table streaks enable row level security;
alter table daily_quests enable row level security;
alter table ai_conversations enable row level security;
alter table confidence_records enable row level security;
alter table skills enable row level security;
alter table achievements enable row level security;

-- profiles: 本人のみ読み書き可能
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

-- profile_idを持つテーブル共通: 本人のみ読み書き可能
create policy "user_skills_all_own" on user_skills
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "quest_attempts_all_own" on quest_attempts
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "user_achievements_all_own" on user_achievements
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "streaks_all_own" on streaks
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "daily_quests_all_own" on daily_quests
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "ai_conversations_all_own" on ai_conversations
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "confidence_records_all_own" on confidence_records
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- quest_hints: 親のquest_attemptsが本人のものかどうかで判定
create policy "quest_hints_all_own" on quest_hints
  for all using (
    exists (
      select 1 from quest_attempts qa
      where qa.id = quest_hints.attempt_id and qa.profile_id = auth.uid()
    )
  );

-- skills / achievements: マスタデータ。ログインユーザーなら誰でも参照可、書き込みは不可
-- (投入はpnpm db:seedがサーバー側の直接DB接続で行うため、ポリシー上の書き込み許可は不要)
create policy "skills_select_authenticated" on skills
  for select using (auth.role() = 'authenticated');

create policy "achievements_select_authenticated" on achievements
  for select using (auth.role() = 'authenticated');
