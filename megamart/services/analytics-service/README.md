# analytics-service

**Responsibility:** Business event capture

**Port:** 3023  
**Datastore:** analytics_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `POST /internal/analytics/events`
- `GET /api/v1/analytics/events`


