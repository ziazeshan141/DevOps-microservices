# promotion-service

**Responsibility:** Coupon and promotion rules

**Port:** 3016  
**Datastore:** promotion_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `POST /api/v1/promotions`
- `POST /api/v1/promotions/validate`
- `GET /api/v1/promotions`


