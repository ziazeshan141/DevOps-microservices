# fraud-service

**Responsibility:** Simple rules-based fraud screening

**Port:** 3024  
**Datastore:** fraud_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `POST /internal/fraud/check`


