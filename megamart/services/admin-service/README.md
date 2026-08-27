# admin-service

**Responsibility:** Admin-only operational facade and audit trail

**Port:** 3021  
**Datastore:** admin_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/admin/summary`
- `POST /api/v1/admin/audit`


