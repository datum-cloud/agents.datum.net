# syntax = docker/dockerfile:1

# ==========================================
# BASE STAGE - Common dependencies and setup
# ==========================================
FROM node:26.13.0-alpine3.24 AS base

RUN apk add --no-cache --upgrade 'ca-certificates>=20261020-r0'
RUN ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBrMQswCQYDVQQG /etc/ssl/certs/ca-certificates.crt

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

# ==========================================
# BUILD STAGE - Compile and prepare the app
# ==========================================
FROM base AS build

ARG VERSION=dev
ENV VERSION=${VERSION}

COPY --link package.json package-lock.json .npmrc ./
RUN npm ci --include=dev --ignore-scripts

COPY --link . .

RUN npm run build && \
    npm prune --omit=dev --ignore-scripts && \
    touch .env

# ==========================================
# PRODUCTION STAGE - Final lightweight image
# ==========================================
FROM base

ARG VERSION=dev
ENV VERSION=${VERSION}

COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

EXPOSE ${PORT}

RUN addgroup -g 1001 datum && \
    adduser -u 1001 -G datum -D -H datum

USER datum

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/ > /dev/null 2>&1 || exit 1

CMD ["node", "./build/server/index.js"]
