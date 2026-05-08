FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --ignore-scripts
COPY . .

RUN mkdir -p storage
RUN rm -rf /app/storage/*
ENV NEXT_PUBLIC_ENABLE_FILE_SYNC=true
RUN pnpm generate:openapi
RUN pnpm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./
RUN pnpm install --prod  --ignore-scripts

COPY --from=builder /app/src/websocket-standalone.js ./src/websocket-standalone.js
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

RUN mkdir -p storage && rm -rf /app/storage/*

CMD [ "pnpm", "run", "start" ]
