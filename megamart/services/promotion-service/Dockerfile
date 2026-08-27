FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev     && npm cache clean --force

COPY --chown=node:node . .

ENV NODE_ENV=production
ENV PORT=3016

EXPOSE 3016

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3   CMD wget -qO- http://127.0.0.1:3016/health >/dev/null 2>&1 || exit 1

CMD ["npm", "start"]
