ALTER TABLE "flashcard" ALTER COLUMN "term" SET DATA TYPE varchar(300);--> statement-breakpoint
ALTER TABLE "flashcard" ALTER COLUMN "definition" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "flashcard_set" ALTER COLUMN "title" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "flashcard_set" ALTER COLUMN "description" SET DATA TYPE varchar(200);