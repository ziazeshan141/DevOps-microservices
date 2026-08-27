# media-service

**Responsibility:** Product image/media metadata

**Port:** 3022  
**Datastore:** media_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/media/product/:productId`
- `POST /api/v1/media`

Phase 1 stores media URLs/metadata, not object-storage binaries.
