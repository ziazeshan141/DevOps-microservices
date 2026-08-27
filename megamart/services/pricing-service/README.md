# pricing-service

**Responsibility:** Product and time-bound sale pricing

**Port:** 3015  
**Datastore:** pricing_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/pricing/:productId`
- `POST /api/v1/pricing`
- `PUT /api/v1/pricing/:id`


