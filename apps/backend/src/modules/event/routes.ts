import { createRoute } from '@hono/zod-openapi'
import {
  eventParamSchema,
  eventResponseSchema,
  eventSchema,
  eventsResponseSchema,
  eventVoteSchema,
  suitableDateEventResponseSchema
} from '@shuffle:shared'

export const getEventsRoute = createRoute({
  method: 'get',
  path: '/events',
  tags: ['Events'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: eventsResponseSchema,
        },
      },
      description: 'Retrieve event',
    },
  },
})

export const getEventRoute = createRoute({
  method: 'get',
  path: '/events/{id}',
  tags: ['Events'],
  request: {
    params: eventParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: eventResponseSchema,
        },
      },
      description: 'Retrieve event',
    },
  },
})
export const postEventVoteRoute = createRoute({
  method: 'post',
  path: '/events/{id}/vote',
  tags: ['Events'],
  request: {
    params: eventParamSchema,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: eventVoteSchema
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: eventResponseSchema,
        },
      },
      description: 'Retrieve event',
    },
  },
})

export const getSuitableDatesRoute = createRoute({
  method: 'get',
  path: 'event/{id}/results',
  tags: ['Events'],
  request: {
    params: eventParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: suitableDateEventResponseSchema,
        },
      },
      description: 'Retrieve event',
    },
  },
})

export const postEventRoute = createRoute({
  method: 'post',
  operationId: 'createEvent',
  tags: ['Events'],
  path: '/events',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: eventSchema
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: eventResponseSchema,
        },
      },
      description: 'Retrieve event',
    },
  },
})
