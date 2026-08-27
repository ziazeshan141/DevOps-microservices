# address-service

**Responsibility:** Customer shipping/billing addresses

**Port:** 3018  
**Datastore:** address_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/addresses`
- `POST /api/v1/addresses`
- `GET /api/v1/addresses/:id`
- `DELETE /api/v1/addresses/:id`


