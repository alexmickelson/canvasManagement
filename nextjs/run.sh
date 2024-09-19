#!/bin/bash

docker run -it --rm \
  --name canvas-manager-2 \
  -u 1000:1000 \
  -p 3000:3000 \
  -w /app \
  -v .:/app \
  -v ~/projects/faculty/1810/2024-fall-alex/modules:/app/storage/intro_to_web \
  node \
    bash -c "npm i && npm run dev -- -H 0.0.0.0"
