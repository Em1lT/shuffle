FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

RUN bun install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/


FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=install /app/apps/backend ./apps/backend
COPY --from=install /app/packages ./packages
COPY --from=install /app/package.json /app/bun.lock ./

WORKDIR /app/apps/backend
EXPOSE 3000

CMD ["bun", "index.ts"]
