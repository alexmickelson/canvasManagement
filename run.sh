#!/bin/bash

docker run -it --rm \
  --name canvas-manager-2 \
  -e TZ=America/Denver \
  -e NODE_ENV=development \
  -e "NEXT_PUBLIC_ENABLE_FILE_SYNC=true" \
  -u 1000:1000 \
  -p 3000:3000 \
  -w /app \
  -v .:/app \
  -v ~/projects/faculty/4850_AdvancedFE/2025-fall-alex/modules:/app/storage/advanced_frontend \
  -v ~/projects/faculty/1810/2025-fall-alex/modules:/app/storage/intro_to_web \
  -v ~/projects/faculty/1430/2025-fall-alex/modules:/app/storage/ux \
  -v ~/projects/faculty/1420/2025-fall-alex/modules:/app/storage/1420 \
  -v ~/projects/faculty/1425/2025-fall-alex/modules:/app/storage/1425 \
  -v ~/projects/public:/app/public/images/public \
  -v ~/projects/facultyFiles:/app/public/images/facultyFiles \
  node \
    sh -c "
      mkdir -p ~/.npm-global && \
      npm config set prefix '~/.npm-global' && \
      export PATH=~/.npm-global/bin:\$PATH && \

      npm install -g pnpm && \
      pnpm install && pnpm dev
    "

  # -v ~/projects/faculty/4850_AdvancedFE/2024-fall-alex/modules:/app/storage/advanced_frontend_old \
  # -v ~/projects/faculty/1810/2025-spring-alex/in-person:/app/storage/intro_to_web_old \
  # -v ~/projects/faculty/1400/2025_spring_alex/modules:/app/storage/1400 \
  # -v ~/projects/faculty/1405/2025_spring_alex:/app/storage/1405 \
  # -v ~/projects/faculty/3840_Telemetry/2025_spring_alex/modules:/app/storage/telemetry \
  # -v ~/projects/faculty/4620_Distributed/2025Spring/modules:/app/storage/distributed \
  # -v ~/projects/faculty/1430/2024-fall-alex/modules:/app/storage/ux_old \
  # -v ~/projects/faculty/1420/2024-fall/Modules:/app/storage/1420_old \
  # -v ~/projects/faculty/1425/2024-fall/Modules:/app/storage/1425_old \

    # bash -c "npm i -g pnpm && pnpm i && pnpm run dev -- -H 0.0.0.0"
