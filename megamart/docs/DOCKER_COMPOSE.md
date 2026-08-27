# MegaMart Docker Compose - Phase 3

This Compose stack runs all 24 MegaMart application services plus PostgreSQL, Redis, and RabbitMQ on one bridge network.

## Start

From the repository root:

```powershell
Copy-Item .env.compose.example .env
docker compose build
docker compose up -d
```

Or build and start in one command:

```powershell
docker compose up -d --build
```

## Check status

```powershell
docker compose ps
```

The API gateway is exposed on:

```text
http://localhost:3020
```

Health check:

```powershell
curl http://localhost:3020/health
```

RabbitMQ Management UI:

```text
http://localhost:15672
```

Default local credentials are `megamart` / `megamart` unless overridden in `.env`.

## Logs

```powershell
docker compose logs -f api-gateway
docker compose logs -f auth-service
docker compose logs -f postgres
```

## Stop

```powershell
docker compose down
```

## Stop and delete local database/Redis/RabbitMQ data

```powershell
docker compose down -v
```

**Warning:** `-v` deletes all data in the Compose named volumes.

## Local database model

For local Phase 3, one PostgreSQL server hosts separate logical databases for the stateful services. This keeps the database-per-service ownership model while avoiding 19 PostgreSQL containers on a developer laptop. In a later production architecture, these can be split into separate database instances/clusters as needed.
