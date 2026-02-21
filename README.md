# UpMonitor

**Monitor your websites. Get status, response times, and uptime in one place.**

A full-stack uptime monitoring app: add URLs, get periodic health checks, view response times and status history—all from a simple dashboard.

---

## Features

- **Website monitoring** — Add URLs and track uptime with automatic health checks
- **Response time & status** — See latency and Up/Down status per check
- **Multi-region workers** — Run workers by region for distributed checks
- **Real-time pipeline** — Redis Streams + worker + pusher for scalable job processing
- **Auth** — Sign up / sign in with JWT; protected API and dashboard
- **Modern stack** — Next.js 16, React 19, Express, Prisma, Bun, Redis, PostgreSQL

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│     API     │────▶│  PostgreSQL │
│  (Next.js)  │     │  (Express)  │     │   (Prisma)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
       │                    │
       │                    │ xAdd
       │                    ▼
       │             ┌─────────────┐
       │             │    Redis    │
       │             │  (Streams) │
       │             └──────┬──────┘
       │                    │
       │         ┌──────────┴──────────┐
       │         ▼                     ▼
       │  ┌─────────────┐      ┌─────────────┐
       │  │   Worker    │      │   Pusher    │
       │  │ (fetch URLs, │      │ (enqueue    │
       │  │  write ticks)│      │  all sites) │
       │  └─────────────┘      └─────────────┘
       │         │
       └─────────┴──────────────────────────────▶ User sees status & history
```

---

## Tech stack

| Layer      | Tech |
|-----------|------|
| Frontend  | Next.js 16, React 19, Tailwind CSS |
| API       | Express, JWT, CORS |
| Database  | PostgreSQL, Prisma |
| Queue     | Redis (Streams) |
| Runtime   | Bun |
| Monorepo  | Turborepo, workspaces |

---

## Prerequisites

- **Bun** ≥ 1.0 ([install](https://bun.sh/docs/installation))
- **PostgreSQL** (local or Docker)
- **Redis** (local or Docker)

---

## Quick start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd BetterStack
bun install
```

### 2. Environment

Create `.env` files where needed (e.g. root or `apps/api`, `packages/db`, `apps/worker`, `apps/pusher`).

**API / DB / Worker / Pusher** (e.g. `apps/api/.env` or root `.env`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/betterstack"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret"
```

**Frontend** (optional, for API URL):

```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:3002"
```

### 3. Database

From repo root (or `packages/db`):

```bash
cd packages/db
bunx prisma migrate deploy
# or for dev: bunx prisma migrate dev
```

### 4. Run everything (dev)

From repo root:

```bash
bun run dev
```

This starts:

- **Frontend** — http://localhost:3000  
- **API** — http://localhost:3002  
- **Worker** — consumes Redis stream, fetches URLs, writes ticks  
- **Pusher** — enqueues all websites into Redis every 3s  

Make sure **Redis** (and **PostgreSQL**) are running locally or in Docker before starting the worker.

---

## Docker

Run the full stack with Docker Compose:

```bash
docker compose build
docker compose up -d
```

- **App:** http://localhost:3000  
- **API:** http://localhost:3002  
- **Postgres:** `localhost:5432` (user `postgres`, db `betterstack`)  
- **Redis:** `localhost:6379`  

Migrations run automatically when the API container starts. The worker waits for the API to be healthy before starting.

To use a different host port for Postgres (e.g. if 5432 is in use), change the `postgres` service in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"   # host 5433 → container 5432
```

---

## Project structure

```
BetterStack/
├── apps/
│   ├── api/          # Express API (auth, websites, status)
│   ├── frontend/     # Next.js dashboard & pages
│   ├── pusher/       # Enqueues websites to Redis every 3s
│   ├── worker/       # Consumes Redis stream, fetches URLs, writes ticks
│   └── tests/        # E2E / integration tests
├── packages/
│   ├── db/           # Prisma schema, client, migrations
│   ├── redis/        # Redis Streams client (xAdd, xReadGroup, etc.)
│   ├── ui/           # Shared UI (if used)
│   ├── eslint-config/
│   └── typescript-config/
├── docker-compose.yml
├── package.json
├── turbo.json
└── README.md
```

---

## Scripts

| Command | Description |
|--------|-------------|
| `bun run dev` | Start frontend, api, worker, pusher (Turborepo) |
| `bun run build` | Build all apps/packages |
| `bun run check-types` | Type-check all packages |
| `bun run lint` | Lint all packages |
| `bun run format` | Format with Prettier |

---

## Environment variables

| Variable | Where | Description |
|----------|--------|-------------|
| `DATABASE_URL` | API, Worker, Pusher, DB | PostgreSQL connection string |
| `REDIS_URL` | API, Worker, Pusher | Redis connection string (default `redis://localhost:6379`) |
| `JWT_SECRET` | API | Secret for signing JWTs |
| `REGION_ID` | Worker | Consumer group / region (default `dev`) |
| `WORKER_ID` | Worker | Worker identifier (default `worker1`) |
| `NEXT_PUBLIC_BACKEND_URL` | Frontend | API base URL (e.g. `http://localhost:3002`) |

---

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/sign-up` | Register (username, password) |
| POST | `/user/sign-in` | Login, returns JWT |
| GET | `/websites` | List user's websites (requires `Authorization`) |
| POST | `/website` | Add website (requires `Authorization`) |
| GET | `/status/:websiteId` | Website + recent ticks (requires `Authorization`) |
| GET | `/health` | Health check (no auth) |

---


