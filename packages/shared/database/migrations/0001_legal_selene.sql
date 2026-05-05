ALTER TABLE "event_dates" ALTER COLUMN "id" SET DEFAULT uuidv7();--> statement-breakpoint
ALTER TABLE "event_votes" ALTER COLUMN "id" SET DEFAULT uuidv7();--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" SET DEFAULT uuidv7();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuidv7();--> statement-breakpoint
ALTER TABLE "event_dates" ADD CONSTRAINT "unique_event_date" UNIQUE("eventId","date");--> statement-breakpoint
ALTER TABLE "event_votes" ADD CONSTRAINT "unique_user_event_vote" UNIQUE("name","eventId");