DO $$ BEGIN
    CREATE TYPE "public"."article_state" AS ENUM('posted', 'archived', 'draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."message_state" AS ENUM('opened', 'archived', 'new');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."user_type" AS ENUM('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "contacts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"message" text NOT NULL,
	"state" "message_state",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"login" text NOT NULL,
	"password" text NOT NULL,
	"avatar" text,
	"userType" "user_type",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "users_login_unique" UNIQUE("login")
);
--> statement-breakpoint
ALTER TABLE "article_table" ADD CONSTRAINT "article_table_fr_extended_article_table_id_fk" FOREIGN KEY ("fr") REFERENCES "public"."extended_article_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_table" ADD CONSTRAINT "article_table_en_extended_article_table_id_fk" FOREIGN KEY ("en") REFERENCES "public"."extended_article_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extended_article_table" ADD CONSTRAINT "extended_article_table_topic_id_topic_table_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;