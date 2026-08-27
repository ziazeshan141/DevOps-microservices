# payment-service

**Responsibility:** Payment authorization/capture simulation

**Port:** 3008  
**Datastore:** payment_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `POST /internal/payments/charge`
- `GET /api/v1/payments/:id`

This service intentionally uses a mock provider in Phase 1. It never processes real card data.
