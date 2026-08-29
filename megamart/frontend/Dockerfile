# ============================================================
# Stage 1 - Build React/Vite application
# ============================================================

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


# ============================================================
# Stage 2 - NGINX Production Runtime
# ============================================================

FROM nginx:1.30.4-alpine3.24

# Install latest patched Alpine packages
RUN apk upgrade --no-cache

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend build
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s \
            --timeout=5s \
            --start-period=10s \
            --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]