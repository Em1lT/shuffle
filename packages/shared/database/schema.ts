import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	name: text("name").notNull(),
});

export const events = pgTable("events", {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
	name: text("name").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
		.notNull()
		.defaultNow(),
});

export const eventDates = pgTable(
	"event_dates",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		name: text("name"),
		date: timestamp("date", { precision: 3, mode: "date" }).notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.notNull()
			.defaultNow(),
		eventId: uuid("eventId")
			.notNull()
			.references(() => events.id),
	},
	(t) => [
		unique("unique_event_date").on(t.eventId, t.date), // unique event per date
	],
);

export const eventVotes = pgTable(
	"event_votes",
	{
		id: uuid("id").primaryKey().default(sql`uuidv7()`),
		name: text("name").notNull(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.notNull()
			.defaultNow(),
		dateId: uuid("dateId")
			.notNull()
			.references(() => eventDates.id),
		eventId: uuid("eventId")
			.notNull()
			.references(() => events.id),
		userId: uuid("userId")
			.notNull()
			.references(() => users.id),
	},
	(t) => [
		unique("unique_user_event_vote").on(t.name, t.eventId, t.dateId),
	],
);

export const usersRelations = relations(users, ({ many }) => ({
	votes: many(eventVotes),
}));

export const eventsRelations = relations(events, ({ many }) => ({
	eventDates: many(eventDates),
	votes: many(eventVotes),
}));

export const eventDatesRelations = relations(eventDates, ({ one, many }) => ({
	event: one(events, {
		fields: [eventDates.eventId],
		references: [events.id],
	}),
	votes: many(eventVotes),
}));

export const eventVotesRelations = relations(eventVotes, ({ one }) => ({
	date: one(eventDates, {
		fields: [eventVotes.dateId],
		references: [eventDates.id],
	}),
	event: one(events, {
		fields: [eventVotes.eventId],
		references: [events.id],
	}),
	user: one(users, {
		fields: [eventVotes.userId],
		references: [users.id],
	}),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventDate = typeof eventDates.$inferSelect;
export type NewEventDate = typeof eventDates.$inferInsert;
export type EventVote = typeof eventVotes.$inferSelect;
export type NewEventVote = typeof eventVotes.$inferInsert;
