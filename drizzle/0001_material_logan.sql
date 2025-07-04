CREATE TYPE "user_type" AS ENUM ('admin', 'user');

CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"contact_id" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"login" text NOT NULL,
	"password" text NOT NULL,
	"type" "user_type",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "users_login_unique" UNIQUE("login")
);
--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN "message";