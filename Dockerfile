FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install
COPY . .

RUN mkdir -p storage
RUN rm -rf /app/storage/*
RUN pnpm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./
RUN pnpm install --prod

COPY --from=builder /app/src/websocket.js ./src/websocket.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN mkdir -p storage && rm -rf /app/storage/*

CMD [ "pnpm", "run", "start" ]
