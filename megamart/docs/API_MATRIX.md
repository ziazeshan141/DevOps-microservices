# API ownership matrix

- Auth: `/api/v1/auth/*`
- Users: `/api/v1/users/*`
- Products: `/api/v1/products/*`
- Catalog: `/api/v1/catalog/*`
- Inventory: `/api/v1/inventory/*`
- Cart: `/api/v1/cart*`
- Orders: `/api/v1/orders/*`
- Payments: `/api/v1/payments/*`
- Shipping: `/api/v1/shipping/*`
- Reviews: `/api/v1/reviews/*`
- Ratings: `/api/v1/ratings/*`
- Search: `/api/v1/search`
- Recommendations: `/api/v1/recommendations`
- Pricing: `/api/v1/pricing/*`
- Promotions: `/api/v1/promotions/*`
- Wishlist: `/api/v1/wishlist/*`
- Addresses: `/api/v1/addresses/*`
- Checkout: `/api/v1/checkout`
- Admin: `/api/v1/admin/*`
- Media: `/api/v1/media/*`
- Analytics: `/api/v1/analytics/*`

Internal-only endpoints live under `/internal/*` and require `X-Service-Token`.
