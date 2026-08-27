# MegaMart — Phase 1 Application Layer

MegaMart is a 24-service Node.js/Express learning project designed for application-first microservice development before containerization and cloud infrastructure.

## Deliberately not included

- Dockerfiles / Docker Compose
- Kubernetes manifests
- Terraform
- GitHub Actions / Argo CD
- Prometheus / Grafana

Those are intended for later DevOps practice.

## Services

| # | Service | Port | Datastore |
|---:|---|---:|---|
| 1 | `auth-service` | 3001 | auth_db |
| 2 | `user-service` | 3002 | user_db |
| 3 | `product-service` | 3003 | product_db |
| 4 | `catalog-service` | 3004 | catalog_db |
| 5 | `inventory-service` | 3005 | inventory_db |
| 6 | `cart-service` | 3006 | cart_db |
| 7 | `order-service` | 3007 | order_db |
| 8 | `payment-service` | 3008 | payment_db |
| 9 | `shipping-service` | 3009 | shipping_db |
| 10 | `notification-service` | 3010 | stateless |
| 11 | `review-service` | 3011 | review_db |
| 12 | `rating-service` | 3012 | rating_db |
| 13 | `search-service` | 3013 | stateless |
| 14 | `recommendation-service` | 3014 | stateless |
| 15 | `pricing-service` | 3015 | pricing_db |
| 16 | `promotion-service` | 3016 | promotion_db |
| 17 | `wishlist-service` | 3017 | wishlist_db |
| 18 | `address-service` | 3018 | address_db |
| 19 | `checkout-service` | 3019 | stateless |
| 20 | `api-gateway` | 3020 | stateless |
| 21 | `admin-service` | 3021 | admin_db |
| 22 | `media-service` | 3022 | media_db |
| 23 | `analytics-service` | 3023 | analytics_db |
| 24 | `fraud-service` | 3024 | fraud_db |

## Prerequisites

- Node.js 22+
- PostgreSQL
- Optional: Redis for search caching
- Optional: RabbitMQ for domain-event publishing

## First local run

1. Create PostgreSQL databases: `psql -U postgres -f docs/sql/create-databases.sql`
2. From the repository root, run `npm run copy-envs`.
3. Adjust the PostgreSQL username/password in each generated `.env` if yours differs from `postgres/postgres`.
4. Run `npm run install-all`.
5. Run `npm run check`.
6. Run `npm run start-all`.
7. Use the API gateway at `http://localhost:3020`.

The database tables create themselves when each database-backed service starts.

## Seed/test flow

See `docs/LOCAL_TEST_FLOW.md` for register → profile → product/catalog/inventory/pricing → cart → checkout → order.

## Security boundary

This is a portfolio/training application, not production payment software. Payment is simulated. Internal service calls use `X-Service-Token`; customer calls use JWT access tokens. Change all example secrets before using outside a local machine.
