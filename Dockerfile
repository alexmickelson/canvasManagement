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

FROM golang:alpine AS gh-teacher-builder

RUN apk add --no-cache git
# classroom50's gh teacher cli, used for the Classroom 50 integration
ARG CLASSROOM50_REF=main
RUN git clone --depth 1 --branch ${CLASSROOM50_REF} \
  https://github.com/foundation50/classroom50.git /classroom50
WORKDIR /classroom50/cli/gh-teacher
RUN CGO_ENABLED=0 go build -o gh-teacher .

FROM node:22-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

# gh + the gh-teacher extension; authenticated via the GH_TOKEN env var at runtime
RUN apk add --no-cache github-cli git
COPY --from=gh-teacher-builder /classroom50/cli/gh-teacher/gh-teacher \
  /home/node/.local/share/gh/extensions/gh-teacher/gh-teacher
RUN chown -R node:node /home/node/.local

COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./
RUN pnpm install --prod  --ignore-scripts

COPY --from=builder /app/src/websocket-standalone.js ./src/websocket-standalone.js
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

RUN mkdir -p storage && rm -rf /app/storage/*

CMD [ "pnpm", "run", "start" ]
