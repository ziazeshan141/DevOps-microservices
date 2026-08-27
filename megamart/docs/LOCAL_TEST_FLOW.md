# Local end-to-end test flow

All public requests below can go through the gateway at `http://localhost:3020`.

## 1. Create an admin user for catalog setup

Register normally, then in PostgreSQL update its role in `auth_db`:

```sql
UPDATE auth_users SET role='admin' WHERE email='admin@megamart.local';
```

Log in again so the new JWT contains `role=admin`.

## 2. Create category, product, inventory and price

Create a category via `POST /api/v1/catalog/categories`, a product via `POST /api/v1/products`, inventory via `POST /api/v1/inventory`, and a price via `POST /api/v1/pricing` using the admin JWT.

## 3. Register a customer

`POST /api/v1/auth/register` creates credentials and provisions a profile in `user-service` when it is running.

## 4. Add a product to the customer's cart

`POST /api/v1/cart/items` with `{ "productId": "...", "quantity": 1 }`.

## 5. Add an address

`POST /api/v1/addresses` with recipient/address fields.

## 6. Checkout

`POST /api/v1/checkout`:

```json
{
  "addressId": "ADDRESS_UUID",
  "currency": "USD",
  "paymentMethod": { "type": "card" }
}
```

The orchestration is:

`cart → product/pricing → promotion(optional) → fraud → inventory reserve → payment → order → shipping → notification → analytics → cart clear`

To test compensation, send `"simulateFailure": true` in `paymentMethod`; checkout releases any inventory already reserved.
