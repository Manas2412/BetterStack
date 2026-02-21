# Build from monorepo root: docker build -f apps/frontend/Dockerfile .
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Copy workspace so bun install can resolve
COPY package.json bun.lock* ./
COPY apps/frontend ./apps/frontend
COPY packages ./packages

RUN bun install

# Backend URL for client-side requests (set at build time for docker-compose)
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

WORKDIR /app/apps/frontend
RUN bun run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", "start"]
