CREATE TABLE "flashcard" (
	"id" serial PRIMARY KEY NOT NULL,
	"set_id" integer NOT NULL,
	"term" text NOT NULL,
	"definition" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_set" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_star" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"flashcard_id" integer NOT NULL,
	"starred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flashcard" ADD CONSTRAINT "flashcard_set_id_flashcard_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_star" ADD CONSTRAINT "flashcard_star_flashcard_id_flashcard_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcard"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "flashcard_star_idx" ON "flashcard_star" USING btree ("user_id","flashcard_id");