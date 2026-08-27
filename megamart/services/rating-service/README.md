# rating-service

**Responsibility:** Numeric product ratings and aggregates

**Port:** 3012  
**Datastore:** rating_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/ratings/:productId`
- `PUT /api/v1/ratings/:productId`


