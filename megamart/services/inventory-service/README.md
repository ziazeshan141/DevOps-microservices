# inventory-service

**Responsibility:** Stock availability and reservation

**Port:** 3005  
**Datastore:** inventory_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/inventory/:productId`
- `POST /api/v1/inventory`
- `PUT /api/v1/inventory/:productId`
- `POST /api/v1/inventory/:productId/reserve`
- `POST /api/v1/inventory/:productId/release`


