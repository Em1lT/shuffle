ALTER TABLE "event_votes" DROP CONSTRAINT "unique_user_event_vote";--> statement-breakpoint
ALTER TABLE "event_votes" ADD CONSTRAINT "unique_user_event_vote" UNIQUE("name","eventId","dateId");