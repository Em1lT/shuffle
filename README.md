# Shuffle

A scheduling coordination API — create events with proposed dates, let participants vote on their availability, and find the best time that works for everyone.

## Stack

- **Runtime**: Bun
- **Framework**: Hono with `@hono/zod-openapi`
- **Database**: PostgreSQL via Drizzle ORM
- **Validation**: Zod
- **Monorepo**: Bun workspaces

## Structure

```
apps/
  backend/        # Hono API server
packages/
  shared/         # DB schema, validators, environment config
```

## Getting started

This is just a backend but front-end can be made by adding the /apps/frontend folder to the workspace.

### Docs

See the [docs](./docs/philosophy.md) for more information about the tech, stack and design decisions.

### Prerequisites

- Bun v1.3.9+
- PostgreSQL

### Setup

```bash
bun install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://shuffle:postgres@localhost:5432/shuffle-dev
```

Run migrations:

```bash
bun run db:migrate
```

Start the backend:

```bash
bun run dev:backend
```

## API

Base path: `/api/v1`

| Method | Path                    | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | `/events`               | List all events                      |
| POST   | `/events`               | Create an event with proposed dates  |
| GET    | `/events/:id`           | Get a single event with votes        |
| POST   | `/events/:id/vote`      | Submit availability votes            |
| GET    | `/event/:id/results`    | Get the most suitable dates          |
| GET    | `/check_health`         | Health check                         |

Interactive docs available at `/docs/ui` (Swagger UI) and the OpenAPI spec at `/docs/spec`.

## Database scripts

```bash
bun run db:generate      # Generate migration files from schema changes
bun run db:migrate       # Run pending migrations
bun run db:push          # Push schema directly (dev only)
bun run db:studio        # Open Drizzle Studio
```

### openCollection

openCollection folder holds the yml files for the collections. The collection can be use to test the API with an external program. Preferably with Bruno 

https://www.opencollection.com/
