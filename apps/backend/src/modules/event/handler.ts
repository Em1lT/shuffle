import { OpenAPIHono, type RouteHandler } from "@hono/zod-openapi";
import * as eventService from "./service";
import {
	getEventsRoute,
	getEventRoute,
	postEventRoute,
	postEventVoteRoute,
	getSuitableDatesRoute,
} from "./routes";

const app = new OpenAPIHono();

export const listUsersHandler: RouteHandler<typeof getEventsRoute> = async (ctx) => {
	const users = await eventService.getIndividualRegisteredUsers();
	return ctx.json(users);
};

export const getEventsHandler: RouteHandler<typeof getEventsRoute> = async (
	ctx,
) => {
	const events = await eventService.getEvents();
	const users = await eventService.getIndividualRegisteredUsers();
  console.log(users);
	return ctx.json({ events });
};

export const getEventHandler: RouteHandler<typeof getEventRoute> = async (
	ctx,
) => {
	const { id } = ctx.req.valid("param");

	const event = await eventService.getEvent(id);
	if (!event) throw new Error("Event not found");

	return ctx.json(event);
};

export const postEventHandler: RouteHandler<typeof postEventRoute> = async (
	ctx,
) => {
	const data = ctx.req.valid("json");

	const id = await eventService.createEvent(data);
	return ctx.json({ id });
};

export const postEventVoteHandler: RouteHandler<
	typeof postEventVoteRoute
> = async (ctx) => {
	const data = ctx.req.valid("json");
	const { id } = ctx.req.valid("param");

	const event = await eventService.voteOnEvent(id, data);
	return ctx.json(event);
};

export const getSuitableDatesHandler: RouteHandler<
	typeof getSuitableDatesRoute
> = async (ctx) => {
	const { id } = ctx.req.valid("param");

	const event = await eventService.getEventResults(id);
	if (!event) throw new Error("Event not found");
	return ctx.json(event);
};

export const eventHandlers = app
	//.openapi(route, handler)                                  // GET /example
	.openapi(getEventsRoute, getEventsHandler)                  // GET /events
	.openapi(getEventRoute, getEventHandler)                    // GET /events/{id}
	.openapi(getSuitableDatesRoute, getSuitableDatesHandler)    // GET /events/{id}/results
	.openapi(postEventRoute, postEventHandler)                  // POST /events
	.openapi(postEventVoteRoute, postEventVoteHandler);         // POST /events/{id}/vote

export default eventHandlers;
