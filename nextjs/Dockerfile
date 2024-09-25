# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm i
COPY . .

RUN mkdir -p storage
RUN rm -rf /app/storage/*
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN mkdir -p storage && rm -rf /app/storage/*

CMD [ "npm", "run", "start" ]
