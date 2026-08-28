# ============================================================
# Stage 1 - Dependencies
# ============================================================

FROM node:22.23.2-alpine3.24 AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev


# ============================================================
# Stage 2 - Runtime
# ============================================================

FROM node:22.23.2-alpine3.24 AS runtime

WORKDIR /app

# Install latest Alpine security patches
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm \
    && rm -f /usr/local/bin/npx

ENV NODE_ENV=production
ENV PORT=3001

# Copy production dependencies
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules

# Copy application
COPY --chown=node:node src ./src

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health >/dev/null 2>&1 || exit 1

CMD ["node", "src/server.js"]