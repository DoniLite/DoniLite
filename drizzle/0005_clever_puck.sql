CREATE TYPE "public"."message_state" AS ENUM('opened', 'archived', 'new');--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "state" "message_state";