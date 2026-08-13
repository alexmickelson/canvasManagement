#!/bin/bash

docker rm -f canvas-manager-2 2>/dev/null || true

# persistent home for the dev container: keeps the gh cli, its extensions,
# and auth across restarts (the container itself is --rm)
mkdir -p ~/.canvas-manager-dev-home

ENV_FILE_ARGS=()
[ -f .env ] && ENV_FILE_ARGS=(--env-file .env)

docker run -it --rm \
  --name canvas-manager-2 \
  -e TZ=America/Denver \
  -e NODE_ENV=development \
  -e "NEXT_PUBLIC_ENABLE_FILE_SYNC=true" \
  "${ENV_FILE_ARGS[@]}" \
  -u 1000:1000 \
  -p 3000:3000 \
  -w /app \
  -v .:/app \
  -v ~/.canvas-manager-dev-home:/home/node \
  -v ~/faculty/:/app/storage/ \
  -v ~/snowse_public/:/app/public/images/public \
  -v ~/myclasses/facultyFiles:/app/public/images/facultyFiles \
  node \
    sh -c '
      export PATH="$HOME/.local/bin:$PATH"
      if ! command -v gh >/dev/null 2>&1; then
        echo "installing gh cli into $HOME/.local/bin (first run only)..."
        mkdir -p "$HOME/.local/bin"
        GH_VERSION=$(curl -fsSL -o /dev/null -w "%{url_effective}" https://github.com/cli/cli/releases/latest | sed "s|.*/v||")
        curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.tar.gz" \
          | tar -xz -C "$HOME/.local/bin" --strip-components=2 "gh_${GH_VERSION}_linux_amd64/bin/gh" \
          || echo "WARNING: could not download gh, classroom 50 buttons will not work"
      fi
      if command -v gh >/dev/null 2>&1 && ! gh extension list 2>/dev/null | grep -q gh-teacher; then
        gh extension install foundation50/gh-teacher \
          || echo "WARNING: could not install gh-teacher (needs auth: set GH_TOKEN in .env, or docker exec -it canvas-manager-2 gh auth login)"
      fi
      npx --yes pnpm dev
    '
