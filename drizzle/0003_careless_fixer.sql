CREATE TYPE "public"."job_status" AS ENUM('pending', 'running', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('article_translation', 'newsletter_send');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('new_message', 'new_subscriber', 'job_failed', 'translation_generated');--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "job_type" NOT NULL,
	"status" "job_status" DEFAULT 'pending' NOT NULL,
	"payload" jsonb NOT NULL,
	"result" jsonb,
	"error" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"last_run_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "notification_type" NOT NULL,
	"message" text NOT NULL,
	"link" text,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "unsubscribe_token" text;--> statement-breakpoint
UPDATE "newsletter_subscribers" SET "unsubscribe_token" = md5(random()::text || clock_timestamp()::text) WHERE "unsubscribe_token" IS NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ALTER COLUMN "unsubscribe_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "unsubscribed_at" timestamp;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_unsubscribe_token_unique" UNIQUE("unsubscribe_token");