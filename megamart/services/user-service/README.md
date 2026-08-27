# user-service

**Responsibility:** Customer profile management

**Port:** 3002  
**Datastore:** user_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `POST /internal/users`
- `GET /api/v1/users/:id`
- `GET /api/v1/users/:id/profile`
- `PUT /api/v1/users/:id`
- `DELETE /api/v1/users/:id`


