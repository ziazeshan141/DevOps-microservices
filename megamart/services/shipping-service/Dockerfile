# ============================================================
# Stage 1 - Production Dependencies
# ============================================================

FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev


# ============================================================
# Stage 2 - Production Runtime
# ============================================================

FROM node:22-alpine AS runtime

WORKDIR /app

# Apply Alpine security updates and remove npm from runtime
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm \
    && rm -f /usr/local/bin/npx

ENV NODE_ENV=production
ENV PORT=3009

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node package.json ./package.json
COPY --chown=node:node src ./src

USER node

EXPOSE 3009

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3009/health >/dev/null 2>&1 || exit 1

CMD ["node", "src/server.js"]
