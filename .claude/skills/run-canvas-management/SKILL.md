---
name: run-canvas-management
description: Build, launch, and drive canvasManagement — start the dev server in Docker, screenshot pages with a real browser, and run the tests, typecheck, lint, and production build. Use when asked to run, start, screenshot, or confirm a change works in the real app.
---

canvasManagement is a TanStack Start + Vite SSR app that edits Canvas LMS course
content stored as markdown on disk. It only makes sense with the faculty course
files mounted, so it runs in Docker, not on the WSL host.

There is **no browser on this host** — no chromium, no playwright, no
`chromium-cli`. The app is driven by `.claude/skills/run-canvas-management/driver.mjs`
running inside the Microsoft Playwright container, pointed at the dev server over
`--network host`.

All paths below are relative to the repo root.

## Prerequisites

Docker, plus the browser image (~2GB, one time):

```bash
docker pull mcr.microsoft.com/playwright:v1.56.0-noble
```

`.env` must exist with `CANVAS_TOKEN` and `GH_TOKEN`. The Classroom 50 panels
shell out to `gh`, which lives in the container's persistent home at
`~/.canvas-manager-dev-home` along with the `gh-teacher` extension — `run.sh`
installs both on first boot and they survive restarts.

## Checks that need no container

Host Node 20 is enough for all of these, and they are much faster than launching
the app. Do these first.

```bash
npx tsc --noEmit                              # clean
npx vitest run                                # 192 passed / 34 files
npx eslint . --config eslint.config.mjs       # 0 errors, 20 known warnings
npx vite build                                # nitro output in .output/
```

The 20 eslint warnings are React Compiler rules (`react-hooks/refs`, `purity`,
`set-state-in-effect`) deliberately downgraded in `eslint.config.mjs`. Zero
errors is the passing condition.

## Run (agent path)

**1. Start the dev server detached.** This is `run.sh` minus its `-it`, which
fails without a TTY:

```bash
docker rm -f canvas-manager-2 >/dev/null 2>&1
docker run -d --name canvas-manager-2 \
  -e TZ=America/Denver -e NODE_ENV=development -e NEXT_PUBLIC_ENABLE_FILE_SYNC=true \
  --env-file .env -u 1000:1000 -p 3000:3000 -w /app \
  -v .:/app \
  -v ~/.canvas-manager-dev-home:/home/node \
  -v ~/faculty/:/app/storage/ \
  -v ~/snowse_public/:/app/public/images/public \
  -v ~/myclasses/facultyFiles:/app/public/images/facultyFiles \
  node sh -c 'export PATH="$HOME/.local/bin:$PATH"; npx --yes pnpm@11 dev'
```

**2. Wait for it** (ready in about 10 seconds):

```bash
until curl -sf -o /dev/null --max-time 3 http://localhost:3000/; do sleep 2; done
echo "dev server ready"
```

**3. Drive it.** Pass any number of routes; each becomes a PNG in `/tmp/cm-shots`:

```bash
mkdir -p /tmp/cm-shots
docker run --rm --network host \
  -v "$PWD/.claude/skills/run-canvas-management":/skill:ro \
  -v /tmp/cm-shots:/out \
  -e PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  mcr.microsoft.com/playwright:v1.56.0-noble \
  sh -c 'mkdir -p /tmp/pw && cp /skill/driver.mjs /tmp/pw/ && cd /tmp/pw && npm i playwright@1.56.0 --silent --no-audit --no-fund >/dev/null 2>&1 && node driver.mjs / /course/Maintenance/settings'
```

Each route prints its screenshot path plus the computed background, text colour,
CSS rule count, and the first 120 characters of body text. A styled page reports
`cssRules: 106` and `background: oklch(0.13 0.028 261.692)` (that is
`bg-gray-950`). Single-digit `cssRules` means Tailwind never compiled.

**4. Look at the screenshot.** Read `/tmp/cm-shots/<route-slug>.png`. The driver
exits non-zero on an empty body, but a page can render and still be wrong.

**5. Stop:**

```bash
docker rm -f canvas-manager-2
```

## Useful routes

| route | what it exercises |
|---|---|
| `/` | course list grouped by semester |
| `/course/Maintenance/settings` | Classroom 50 **setup wizard** (unconfigured course) |
| `/course/Mobile%20('26%20Fall)/settings` | Classroom 50 **configured** state, roster status, gh commands |

Course names come from `globalSettings.yml`. Prefer a name without an apostrophe —
`Mobile ('26 Fall)` needs both URL-encoding and shell quoting inside the `sh -c`,
which is miserable to get right.

## Run (human path)

```bash
./run.sh
```

Interactive, holds the terminal, mounts the same volumes. Useless for an agent —
the `-it` flags fail without a TTY.

## Changing dependencies

**Never `pnpm add` on the host.** `node_modules` is linked from the container's
pnpm 11 store at `/app/.pnpm-store`; the host has pnpm 10 and refuses to touch it.
Install through a throwaway container instead:

```bash
docker run --rm -u 1000:1000 -w /app -v .:/app -v ~/.canvas-manager-dev-home:/home/node \
  node sh -c 'npx --yes pnpm@11 add -D <package> --store-dir /app/.pnpm-store'
```

Same wrapper for `install`, `update`, `remove`. Stop the dev container first so
the install is not churning `node_modules` underneath a running vite.

## Gotchas

- **Windows Chrome and Edge are reachable via `/mnt/c` but are a dead end.** Both
  hang indefinitely in `--headless` when launched from WSL, and exit 21 with no
  output file when detached. Don't spend time on flag combinations; use the
  container.
- **`NODE_PATH` does not work for ESM.** Installing playwright globally in the
  container and setting `NODE_PATH` gives `ERR_MODULE_NOT_FOUND`, because ESM
  resolves from the importing file's directory. The driver is copied into the
  install directory for exactly this reason.
- **Without the `~/faculty` mount the app renders zero courses** and looks broken
  rather than misconfigured.
- **Expected noise, not failures:** a `Hydration failed because the server
  rendered text didn't match the client` pageerror on every load, and roughly 60
  `Error loading Quiz ...: question 1: no answers` lines in the server log at
  boot. The quiz errors are malformed content files in `~/faculty`, not code.
- **`networkidle` alone is too early.** TanStack Start streams the shell first;
  the driver waits an extra 2.5s so panels are present in the screenshot.
- **The dev server's `pnpm install` runs on every start** (it is baked into the
  `dev` script), so boot re-verifies the lockfile before vite starts.

## Troubleshooting

| symptom | fix |
|---|---|
| `ERR_PNPM_UNEXPECTED_STORE` | You ran pnpm on the host. Use the container wrapper under "Changing dependencies". |
| `the input device is not a TTY` | You used `run.sh` or its `-it` flags headless. Use the `-d` command above. |
| `ERR_MODULE_NOT_FOUND: playwright` | The driver was run outside its install directory. Keep the `cp /skill/driver.mjs /tmp/pw/` step. |
| Driver prints `EMPTY BODY` and exits 1 | The app did not render. Check `docker logs canvas-manager-2` for a vite or SSR crash. |
| Port 3000 in use | A previous `canvas-manager-2` is still up: `docker rm -f canvas-manager-2`. |
