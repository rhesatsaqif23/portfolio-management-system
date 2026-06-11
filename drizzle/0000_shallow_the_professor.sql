-- Create skill_category enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skill_category') THEN
    CREATE TYPE "public"."skill_category" AS ENUM('mobile', 'web', 'backend', 'devops', 'design', 'other');
  END IF;
END
$$;

-- Add new columns to existing tables
ALTER TABLE "achievements" ADD COLUMN IF NOT EXISTS "sort_order" integer;
ALTER TABLE "achievements" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now();

ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "sort_order" integer;
ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now();

ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "sort_order" integer;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now();

-- Create new tables
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"current_role" text NOT NULL,
	"bio_short" varchar(280),
	"bio_long" text,
	"avatar_url" text,
	"cv_url" text,
	"location" text,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" "skill_category" NOT NULL,
	"icon_url" text,
	"sort_order" integer,
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "case_studies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL REFERENCES "projects"("id"),
	"content_markdown" text NOT NULL,
	"gallery_jsonb" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
