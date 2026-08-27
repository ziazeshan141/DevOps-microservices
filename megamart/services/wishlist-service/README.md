# wishlist-service

**Responsibility:** Customer product wishlists

**Port:** 3017  
**Datastore:** wishlist_db

## Run

1. Copy `.env.example` to `.env`.
2. If this service has a PostgreSQL database, create it using `../../docs/sql/create-databases.sql`.
3. Run `npm install`.
4. Run `npm start`.

## Endpoints

- `GET /api/v1/wishlist`
- `POST /api/v1/wishlist/:productId`
- `DELETE /api/v1/wishlist/:productId`


