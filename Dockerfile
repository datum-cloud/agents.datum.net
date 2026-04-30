# syntax = docker/dockerfile:1

# ==========================================
# BASE STAGE - Common dependencies and setup
# ==========================================
FROM oven/bun:1.3.13 AS base

RUN apt-get update && \
    apt-get install -y --no-install-recommends unzip ca-certificates wget && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    BUN_RUNTIME_TRANSPILER_CACHE_PATH=/tmp/bun-transpiler-cache

# ==========================================
# BUILD STAGE - Compile and prepare the app
# ==========================================
FROM base AS build

ARG VERSION=dev
ENV VERSION=${VERSION}

COPY --link package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY --link . .

RUN bun run build && \
    bun install --production --frozen-lockfile && \
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

RUN groupadd --gid 1001 datum && \
    useradd --uid 1001 --gid 1001 --no-create-home datum && \
    chown -R datum:datum /app

USER datum

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/ > /dev/null 2>&1 || exit 1

CMD ["bun", "run", "start"]
