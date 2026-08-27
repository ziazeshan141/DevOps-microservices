# auth-service

**Responsibility:** Registration, login, access JWTs, refresh token rotation and logout

**Port:** 3001  
**Datastore:** auth_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /health`
- `GET /ready`

Registration attempts to provision a matching profile in `user-service`.
