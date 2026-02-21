# Build from monorepo root: docker build -f apps/api/Dockerfile .
FROM oven/bun:1-alpine AS base
RUN apk add --no-cache wget
WORKDIR /app

# Install deps (copy workspace files for bun install)
COPY package.json bun.lock* ./
COPY apps/api ./apps/api
COPY packages/db ./packages/db
COPY packages/redis ./packages/redis

RUN bun install

# Generate Prisma client
WORKDIR /app/packages/db
RUN bunx prisma generate

WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 3002
CMD ["sh", "-c", "cd /app/packages/db && bunx prisma migrate deploy && cd /app/apps/api && exec bun run index.ts"]
