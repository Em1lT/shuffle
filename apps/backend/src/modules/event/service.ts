import { eq, and, exists, inArray, sql } from 'drizzle-orm'
import { format } from 'date-fns'
import { db } from '@shuffle:shared/database'
import {
  eventDates,
  events,
  eventVotes,
  users
} from '@shuffle:shared/database/schema'


const eventInfoQuery = (id: string) =>
  db.select({
    id: events.id,
    name: events.name,
    dates: sql<string[]>`json_agg(${eventDates.date})`,
    votes: sql<{ date: string; people: string[] }[]>`
      (SELECT coalesce(
        json_agg(
          json_build_object(
            'date', ${eventDates.date},
            'people', (
              SELECT coalesce(json_agg(${users.name}), '[]'::json)
              FROM ${eventVotes}
              LEFT JOIN ${users} ON ${users.id} = ${eventVotes.userId}
              WHERE ${eventVotes.dateId} = ${eventDates.id}
            )
          )
        ),
        '[]'::json
      )
      FROM ${eventDates}
      WHERE ${eventDates.eventId} = ${events.id})
    `.as('votes'),
  })
    .from(events)
    .leftJoin(eventDates, eq(events.id, eventDates.eventId))
    .leftJoin(eventVotes, eq(eventDates.id, eventVotes.eventId))
    .where(eq(events.id, id))
    .groupBy(events.id)
    .limit(1)

export const getEvents = () => {
  return db.select({ id: events.id, name: events.name }).from(events)
}

export const getEvent = async (id: string) => {
  const [event] = await eventInfoQuery(id)
  return event ?? null
}

export const createEvent = async (data: { name: string; dates: Date[] }) => {
  const eventId = await db.transaction(async (tx) => {
    const [created] = await tx.insert(events).values({ name: data.name }).returning()
    if (!created) throw new Error('Failed to create event')

    const eventDateItems = data.dates.map((date) => ({ eventId: created.id, date }))
    await tx.insert(eventDates).values(eventDateItems)

    return created.id
  })

  return eventId
}

export const voteOnEvent = async (id: string, data: { name: string; votes: Date[] }) => {
  const event = await db.query.events.findFirst({
    where: and(
      eq(events.id, id),
      exists(
        db.select()
          .from(eventDates)
          .where(and(
            eq(eventDates.eventId, events.id),
            inArray(eventDates.date, data.votes)
          ))
      )
    ),
    with: { eventDates: true },
  })

  if (!event) throw new Error('Event not found')

  const eventId = await db.transaction(async (tx) => {
    const [existingVote] = await tx
      .select({ userId: users.id })
      .from(eventVotes)
      .leftJoin(users, eq(eventVotes.userId, users.id))
      .where(and(eq(eventVotes.eventId, event.id), eq(users.name, data.name)))
      .limit(1)

    let userId: string
    if (existingVote?.userId) {
      userId = existingVote.userId
    } else {
      const [newUser] = await tx.insert(users).values({ name: data.name }).returning()
      if (!newUser) throw new Error('Failed to create user')
      userId = newUser.id
    }

    await Promise.all(
      data.votes.map(async (date) => {
        const dateId = event.eventDates.find(
          (d) => format(d.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        )?.id
        if (!dateId) return
        await tx.insert(eventVotes).values({ eventId: event.id, dateId, userId, name: data.name })
      })
    )

    return event.id
  })

  const [updated] = await eventInfoQuery(eventId)
  return updated
}

export const getEventResults = async (id: string) => {
  const participantCount = sql`(SELECT count(*) FROM ${eventVotes} WHERE ${eventVotes.eventId} = ${events.id})`

  const rows = await db.select({
    id: events.id,
    name: events.name,
    suitableDates: sql<{ date: string; people: string[] }[]>`
      (SELECT coalesce(
        json_agg(
          json_build_object(
            'date', ${eventDates.date},
            'people', (
              SELECT coalesce(json_agg(${users.name}), '[]'::json)
              FROM ${eventVotes}
              LEFT JOIN ${users} ON ${users.id} = ${eventVotes.userId}
              WHERE ${eventVotes.dateId} = ${eventDates.id}
            )
          )
        ),
        '[]'::json
      )
      FROM ${eventDates}
      WHERE ${eventDates.eventId} = ${events.id}
      AND (
        SELECT count(*) FROM ${eventVotes} WHERE ${eventVotes.dateId} = ${eventDates.id}
      ) = ${participantCount})
    `.as('suitableDates'),
  })
    .from(events)
    .leftJoin(eventVotes, eq(events.id, eventVotes.eventId))
    .where(eq(events.id, id))
    .groupBy(events.id)

  const [event] = rows
  return event ?? null
}
