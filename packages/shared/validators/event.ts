import { z } from '@hono/zod-openapi'

export const eventSchema =
  z.object({
    name: z
      .string()
      .min(3),
    dates: z.array(z.coerce.date().min(new Date()))
  })

export const eventsResponseSchema =
  z.object({
    events: z.array(z.object({
      id: z.string(),
      name: z.string(),
    }))
  })

export const datesSchema =
  z.object({
    date: z.date(),
    people: z.array(z.string())
  })

export const suitableDateEventResponseSchema =
  z.object({
    id: z.string(),
    name: z.string(),
    suitableDates: z.array(datesSchema),
  })

export const eventResponseSchema =
  z.object({
    id: z.string(),
  })

export const eventVoteSchema =
  z.object({
    name: z.string(),
    votes: z.array(z.coerce.date())
  })


export const createEventResponseSchema =
  z.object({
    name: z
      .string()
      .min(3),
    dates: z.array(z.date().min(new Date()))
  })

export const eventParamSchema =
  z.object({
    id: z.string()
  })
