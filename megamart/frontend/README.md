# MegaMart Frontend

React + Vite customer storefront for the MegaMart microservices project.

## Application path

Browser -> frontend -> API Gateway (`:3020`) -> backend microservices.

The frontend never calls the individual backend service ports directly.

## Pages

- Home / recommendations
- Product catalog and search
- Product detail, reviews and ratings
- Register / login / JWT refresh
- Cart and wishlist
- Addresses
- Checkout orchestration
- Orders and shipping tracking
- Profile
- Admin dashboard (admin JWT only)

## Run locally without Docker

Make sure the API Gateway and its dependencies are running first.

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api/*` to `http://localhost:3020`.

## Run with Docker Compose

From the MegaMart root:

```powershell
docker compose up -d --build
```

Open `http://localhost:8080`.

The nginx frontend container proxies `/api/*` to `api-gateway:3020`, avoiding browser CORS issues.

## Catalog note

The storefront displays data from the backend databases. A fresh environment has an empty catalog until products, prices and inventory records are created. Use the Phase 1 Postman collection/admin endpoints to add sample catalog data.
