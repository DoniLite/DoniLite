CREATE TYPE "public"."article_state" AS ENUM('posted', 'archived', 'draft');--> statement-breakpoint
CREATE TABLE "article_table" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "article_state",
	"fr" text,
	"en" text,
	"views" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "extended_article_table" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"slug" text[],
	"topic_id" text,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic_table" (
	"id" text PRIMARY KEY NOT NULL,
	"topic" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_table" ADD CONSTRAINT "article_table_fr_extended_article_table_id_fk" FOREIGN KEY ("fr") REFERENCES "public"."extended_article_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_table" ADD CONSTRAINT "article_table_en_extended_article_table_id_fk" FOREIGN KEY ("en") REFERENCES "public"."extended_article_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extended_article_table" ADD CONSTRAINT "extended_article_table_topic_id_topic_table_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic_table"("id") ON DELETE no action ON UPDATE no action;