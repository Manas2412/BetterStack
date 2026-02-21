# Build from monorepo root: docker build -f apps/worker/Dockerfile .
FROM oven/bun:1-alpine AS base
WORKDIR /app

COPY package.json bun.lock* ./
COPY apps/worker ./apps/worker
COPY packages/db ./packages/db
COPY packages/redis ./packages/redis

RUN bun install

WORKDIR /app/packages/db
RUN bunx prisma generate

WORKDIR /app/apps/worker
ENV NODE_ENV=production
ENV REGION_ID=dev
ENV WORKER_ID=worker1
CMD ["bun", "run", "index.ts"]
