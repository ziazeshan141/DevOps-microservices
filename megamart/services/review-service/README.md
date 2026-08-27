# review-service

**Responsibility:** Written product reviews

**Port:** 3011  
**Datastore:** review_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/reviews/product/:productId`
- `POST /api/v1/reviews`


