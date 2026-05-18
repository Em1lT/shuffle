import { describe, it, expect, mock, beforeEach, type Mock } from "bun:test";

// --- mock service before any import that resolves it ---
mock.module("../service", () => ({
	getEvents: mock(async () => []),
	getEvent: mock(async () => null),
	createEvent: mock(async () => "evt-1"),
	voteOnEvent: mock(async () => ({
		id: "evt-1",
		name: "Test Event",
		dates: [],
		votes: [],
	})),
	getEventResults: mock(async () => null),
}));

import { OpenAPIHono } from "@hono/zod-openapi";
import * as eventService from "../service";
import eventHandlers from "../handler";

// Mirror how server.ts mounts the module
const app = new OpenAPIHono().route("/api/v1", eventHandlers);

function resetServiceMocks() {
	(eventService.getEvents as Mock<typeof eventService.getEvents>).mockReset();
	(eventService.getEvent as Mock<typeof eventService.getEvent>).mockReset();
	(
		eventService.createEvent as Mock<typeof eventService.createEvent>
	).mockReset();
	(
		eventService.voteOnEvent as Mock<typeof eventService.voteOnEvent>
	).mockReset();
	(
		eventService.getEventResults as Mock<typeof eventService.getEventResults>
	).mockReset();
}

describe("Event handlers", () => {
	beforeEach(resetServiceMocks);

	describe("GET /api/v1/event/list", () => {
		it("returns an empty events array", async () => {
			(
				eventService.getEvents as Mock<typeof eventService.getEvents>
			).mockResolvedValue([]);

			const res = await app.request("/api/v1/event/list");

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual({ events: [] });
		});
	});

	describe("GET /api/v1/event/:id", () => {
		it("throws when the event is not found", async () => {
			(
				eventService.getEvent as Mock<typeof eventService.getEvent>
			).mockResolvedValue(null);

			const res = await app.request("/api/v1/event/missing-id");

			expect(res.status).toBe(500);
		});

		it("returns the event when found", async () => {
			const event = { id: "evt-1", name: "Birthday", dates: [], votes: [] };
			(
				eventService.getEvent as Mock<typeof eventService.getEvent>
			).mockResolvedValue(event);

			const res = await app.request("/api/v1/event/evt-1");

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual(event);
		});
	});

	describe("POST /api/v1/event", () => {
		it("creates an event and returns it", async () => {
			const created = { id: "evt-3", name: "New Event", dates: [], votes: [] };
			(
				eventService.createEvent as Mock<typeof eventService.createEvent>
			).mockResolvedValue(created.id);

			const res = await app.request("/api/v1/event", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "New Event", dates: ["2026-06-01"] }),
			});

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual({ id: created.id });
		});
	});

	describe("POST /api/v1/event/:id/vote", () => {
		it("records a vote and returns the updated event", async () => {
			const updated = { id: "evt-1", name: "Birthday", dates: [], votes: [] };
			(
				eventService.voteOnEvent as Mock<typeof eventService.voteOnEvent>
			).mockResolvedValue(updated);

			const res = await app.request("/api/v1/event/evt-1/vote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "Alice", votes: ["2026-06-01"] }),
			});

			expect(res.status).toBe(200);
			expect(await res.json()).toEqual(updated);
		});
	});
});
