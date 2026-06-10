-- Add new columns to profiles (multi-role + social links)
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "current_roles" text[] DEFAULT '{}' NOT NULL;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "github" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "linkedin" text;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "instagram" text;

-- Create stats table for About section
CREATE TABLE IF NOT EXISTS "stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"category" text,
	"sub_value" text,
	"icon" text,
	"sort_order" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
