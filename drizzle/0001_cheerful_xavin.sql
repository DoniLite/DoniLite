CREATE TYPE "public"."article_content_format" AS ENUM('markdown', 'html', 'tiptap_json');--> statement-breakpoint
CREATE TYPE "public"."article_locale" AS ENUM('en', 'fr');--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."article_translation_status" AS ENUM('missing', 'queued', 'generated', 'reviewed', 'published');--> statement-breakpoint
CREATE TABLE "article_seasons" (
	"id" text PRIMARY KEY NOT NULL,
	"series_id" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"position" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "article_series" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "article_series_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"source_locale" "article_locale" DEFAULT 'en' NOT NULL,
	"cover_image" text,
	"series_id" text,
	"season_id" text,
	"episode" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "article_tag_links" (
	"article_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "article_tag_links_article_id_tag_id_pk" PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "article_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "article_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "article_translations" (
	"id" text PRIMARY KEY NOT NULL,
	"article_id" text NOT NULL,
	"locale" "article_locale" NOT NULL,
	"translation_status" "article_translation_status" DEFAULT 'missing' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"content" text DEFAULT '' NOT NULL,
	"content_format" "article_content_format" DEFAULT 'markdown' NOT NULL,
	"content_blocks" jsonb,
	"resources" jsonb,
	"correction_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP TABLE "article_table" CASCADE;--> statement-breakpoint
DROP TABLE "extended_article_table" CASCADE;--> statement-breakpoint
DROP TABLE "topic_table" CASCADE;--> statement-breakpoint
ALTER TABLE "article_seasons" ADD CONSTRAINT "article_seasons_series_id_article_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."article_series"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_series_id_article_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."article_series"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_season_id_article_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."article_seasons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tag_links" ADD CONSTRAINT "article_tag_links_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tag_links" ADD CONSTRAINT "article_tag_links_tag_id_article_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."article_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_translations" ADD CONSTRAINT "article_translations_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "article_translations_article_locale_unique" ON "article_translations" USING btree ("article_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "article_translations_locale_slug_unique" ON "article_translations" USING btree ("locale","slug");--> statement-breakpoint
DROP TYPE "public"."article_state";