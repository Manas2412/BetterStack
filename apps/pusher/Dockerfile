# Build from monorepo root: docker build -f apps/pusher/Dockerfile .
FROM oven/bun:1-alpine AS base
WORKDIR /app

COPY package.json bun.lock* ./
COPY apps/pusher ./apps/pusher
COPY packages/db ./packages/db
COPY packages/redis ./packages/redis

RUN bun install

WORKDIR /app/packages/db
RUN bunx prisma generate

WORKDIR /app/apps/pusher
ENV NODE_ENV=production
CMD ["bun", "run", "index.ts"]
