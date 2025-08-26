# Vehicle Platform

End-to-end demo with Dockerized microservices and a Vite React frontend.

## Overview
- **Frontend**: Vite + React + Tailwind (`frontend`)
- **Services**: `user-service` and `vehicle-service` (Express + Prisma + RabbitMQ)
- **Infra**: Postgres, RabbitMQ (via `docker-compose.yml`)

Dev mode supports hot-reload for all apps via `docker-compose.override.yml`.

## Requirements
- Docker Desktop 4.x+
- Node 18+ (only needed if you run locally outside Docker)

## Quick start (Dev)
From repo root:

```bash
npm run dev:up          # build + start in background
npm run dev:logs        # tail logs
# or
npm run dev             # start in foreground
```

Open:
- Frontend: `http://localhost:3000`
- User API: `http://localhost:3001/health`
- Vehicle API: `http://localhost:3002/health`
- RabbitMQ UI: `http://localhost:15672` (guest/guest)

Stop stack:
```bash
npm run dev:down
```

## How it works (Dev mode)
- `docker-compose.yml` defines base services and healthchecks
- `docker-compose.override.yml` adds bind mounts and dev commands:
  - Frontend: Vite dev server with HMR
  - Services: `nodemon` + `ts-node` with filesystem polling (Windows-friendly)
  - Prisma migrations run on start (`prisma migrate deploy`)

## Environment
The compose files set necessary env vars. Defaults:
- Postgres: `postgres://app:app@postgres:5432/maindb`
- RabbitMQ: `amqp://guest:guest@rabbitmq:5672` (in dev override)
- Frontend API URLs: `VITE_USER_API_URL`, `VITE_VEHICLE_API_URL`

If you add `.env` files inside services, they will be loaded by `dotenv`, but compose-provided env wins at runtime.

## NPM scripts (root)
```json
{
  "dev": "docker compose up --build",
  "dev:up": "docker compose up -d --build",
  "dev:down": "docker compose down",
  "dev:logs": "docker compose logs -f --tail=100"
}
```

## Project structure (important – used by Docker paths)
```
frontend/
user-service/
vehicle-service/
shared/
docker-compose.yml
docker-compose.override.yml
```

## APIs (brief)
- User Service
  - `GET /users`
  - `POST /users` { email, name?, password }
  - `DELETE /users/:id`
  - `GET /health`
- Vehicle Service
  - `GET /vehicles?userId=...`
  - `POST /vehicles` { make, model, year?, userId }
  - `DELETE /vehicles/:id`
  - `GET /health`

User creation publishes a RabbitMQ message; Vehicle service consumer creates a placeholder vehicle for the new user.

## Local development notes
- Frontend HMR is enabled. On Windows, we enable file polling to avoid missed events.
- Services run with `nodemon --legacy-watch` and poll changes.
- Prisma clients are generated in images (`generated/*-client`). Migrations apply automatically on start.

## Common issues & fixes
- Frontend loads but hot reload doesn’t trigger (Windows): already enabled polling; if needed set `VITE_FORCE_HMR_PROXY=true` in frontend service env.
- Backend doesn’t restart on change: ensure files are saved under the mounted paths; nodemon uses legacy watch with polling in override.
- RabbitMQ URL errors: verify `RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672` is present (override provides it for both services).
- Prisma migration errors: clear volumes if needed and re-up, or run `npx prisma migrate reset` inside service container (will wipe data).

## Useful Docker commands
```bash
docker compose ps
docker compose logs service-name --tail=200
docker compose exec user-service sh
docker compose exec vehicle-service sh
```

## Production (outline)
- Build production images with proper `npm run build` steps
- Run services with `node dist/index.js`
- Provide managed Postgres and RabbitMQ endpoints
- Set environment variables via your orchestrator

## License
MIT (example project)