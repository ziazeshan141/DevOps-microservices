# checkout-service

**Responsibility:** Checkout orchestration with inventory compensation

**Port:** 3019  
**Datastore:** Stateless in Phase 1

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `POST /api/v1/checkout`

Coordinates cart → pricing/promotion → fraud → inventory → payment → order → shipping → notification/analytics.
