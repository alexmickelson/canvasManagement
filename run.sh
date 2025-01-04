#!/bin/bash

docker run -it --rm \
  --name canvas-manager-2 \
  -e TZ=America/Denver \
  -e NODE_ENV=development \
  -u 1000:1000 \
  -p 3000:3000 \
  -w /app \
  -v .:/app \
  -v ~/projects/faculty/1810/2024-fall-alex/modules:/app/storage/intro_to_web \
  -v ~/projects/faculty/4850_AdvancedFE/2024-fall-alex/modules:/app/storage/advanced_frontend \
  -v ~/projects/faculty/1810/2025-spring-alex/online:/app/storage/intro_to_web_online \
  -v ~/projects/faculty/1400/2025_spring_alex/modules:/app/storage/1400 \
  -v ~/projects/faculty/3840_Telemetry/2025_spring_alex/modules:/app/storage/telemetry \
  node \
    sh -c "
      mkdir -p ~/.npm-global && \
      npm config set prefix '~/.npm-global' && \
      export PATH=~/.npm-global/bin:\$PATH && \

      npm install -g pnpm && \
      pnpm install && pnpm dev
    "


    # bash -c "npm i -g pnpm && pnpm i && pnpm run dev -- -H 0.0.0.0"
