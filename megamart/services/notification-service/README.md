# notification-service

**Responsibility:** Notification dispatch abstraction

**Port:** 3010  
**Datastore:** Stateless in Phase 1

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `POST /internal/notifications`

Phase 1 logs the delivery and can publish a RabbitMQ event; add email/SMS providers later.
