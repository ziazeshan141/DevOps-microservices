# search-service

**Responsibility:** Product search facade with optional Redis caching

**Port:** 3013  
**Datastore:** Stateless in Phase 1

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/search?q=...`

If Redis is unavailable the service transparently queries `product-service`.
