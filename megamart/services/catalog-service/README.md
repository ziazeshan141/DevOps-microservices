# catalog-service

**Responsibility:** Category hierarchy and catalog navigation

**Port:** 3004  
**Datastore:** catalog_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/catalog/categories`
- `POST /api/v1/catalog/categories`
- `PUT /api/v1/catalog/categories/:id`
- `DELETE /api/v1/catalog/categories/:id`


