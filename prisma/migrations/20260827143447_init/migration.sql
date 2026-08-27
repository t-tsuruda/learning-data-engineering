-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "career_rank" TEXT NOT NULL DEFAULT 'rookie',
    "onboarded_at" TIMESTAMP(3),
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "achievement_stats" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "skill_id" TEXT NOT NULL,
    "mastery_score" INTEGER NOT NULL DEFAULT 0,
    "first_try_count" INTEGER NOT NULL DEFAULT 0,
    "hint_used_count" INTEGER NOT NULL DEFAULT 0,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_attempts" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "quest_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "hints_used" INTEGER NOT NULL DEFAULT 0,
    "confidence_before" INTEGER,
    "confidence_after" INTEGER,
    "idempotency_key" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "quest_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quest_hints" (
    "id" UUID NOT NULL,
    "attempt_id" UUID NOT NULL,
    "hint_level" INTEGER NOT NULL,
    "revealed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quest_hints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "achieved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streaks" (
    "profile_id" UUID NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_active_date" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "daily_quests" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "quest_id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "quest_id" TEXT,
    "messages" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "confidence_records" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "skill_id" TEXT NOT NULL,
    "quest_id" TEXT,
    "level" INTEGER NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "confidence_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_skills_profile_id_idx" ON "user_skills"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_skills_profile_id_skill_id_key" ON "user_skills"("profile_id", "skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "quest_attempts_idempotency_key_key" ON "quest_attempts"("idempotency_key");

-- CreateIndex
CREATE INDEX "quest_attempts_profile_id_idx" ON "quest_attempts"("profile_id");

-- CreateIndex
CREATE INDEX "quest_attempts_quest_id_idx" ON "quest_attempts"("quest_id");

-- CreateIndex
CREATE INDEX "quest_hints_attempt_id_idx" ON "quest_hints"("attempt_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_profile_id_achievement_id_key" ON "user_achievements"("profile_id", "achievement_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_quests_profile_id_date_key" ON "daily_quests"("profile_id", "date");

-- CreateIndex
CREATE INDEX "ai_conversations_profile_id_idx" ON "ai_conversations"("profile_id");

-- CreateIndex
CREATE INDEX "confidence_records_profile_id_skill_id_idx" ON "confidence_records"("profile_id", "skill_id");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_attempts" ADD CONSTRAINT "quest_attempts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quest_hints" ADD CONSTRAINT "quest_hints_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "quest_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_quests" ADD CONSTRAINT "daily_quests_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confidence_records" ADD CONSTRAINT "confidence_records_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confidence_records" ADD CONSTRAINT "confidence_records_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
