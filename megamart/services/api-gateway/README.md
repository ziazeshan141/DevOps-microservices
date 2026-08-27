# api-gateway

**Responsibility:** Single external HTTP entry point and reverse proxy

**Port:** 3020  
**Datastore:** Stateless in Phase 1

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `ALL /api/v1/*`
- `GET /health`
- `GET /ready`

The gateway forwards the original path and Authorization header to the owning service.
