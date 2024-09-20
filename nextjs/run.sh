#!/bin/bash

docker run -it --rm \
  --name canvas-manager-2 \
  -e TZ=America/Denver \
  -u 1000:1000 \
  -p 3000:3000 \
  -w /app \
  -v .:/app \
  -v ~/projects/faculty/1810/2024-fall-alex/modules:/app/storage/intro_to_web \
  -v ~/projects/faculty/4850_AdvancedFE/2024-fall-alex/modules:/app/storage/advanced_frontend \
  node \
    bash -c "npm i && npm run dev -- -H 0.0.0.0"
