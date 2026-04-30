# agents.datum.net

A small, content-driven public website that communicates what Datum is in a format equally legible to AI agents and humans. See [`agents-datum.md`](agents-datum.md) for the full project brief.

## Stack

- React Router v7 (SSR)
- Hono via [`react-router-hono-server`](https://github.com/rphlmr/react-router-hono-server) (Bun runtime)
- Bun runtime + package manager
- Vite
- Tailwind CSS v4
- [`@datum-cloud/datum-ui`](https://github.com/datum-cloud/datum-ui) — Datum's design system (built on shadcn/ui + Radix)
- TypeScript strict

## Theme

Light + dark via the user's OS `prefers-color-scheme`. **Default is light**; dark only activates when the OS explicitly prefers dark. No toggle UI in v1.

Implemented via `@datum-cloud/datum-ui`'s `ThemeProvider` in system mode (`attribute="class"`, `defaultTheme="system"`, `enableSystem`). An inline `<ThemeScript />` in `<head>` resolves the theme before hydration so there's no flash of incorrect theme. See §5.6 of the brief, [`app/root.tsx`](app/root.tsx), and [`app/styles/globals.css`](app/styles/globals.css).

## Prerequisites

- Bun `1.3.13` and Node `24.15.0` (see [`.tool-versions`](.tool-versions))

## Setup

```bash
bun install
cp .env.example .env
```

## Develop

```bash
bun run dev
# http://localhost:3000
```

To verify theme switching: open the page, then change your OS appearance (macOS: System Settings → Appearance → Dark). The page should flip colors live with no reload.

## Build & run production

```bash
bun run build
bun run start
```

## Quality

```bash
bun run lint
bun run typecheck
bun run format:check   # check only (CI)
bun run format         # auto-fix
```

## CI

The GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every PR and push to `main`:

1. **Install** — `bun install --frozen-lockfile` (cached by `bun.lock` hash)
2. **Lint & Format** — `bun run lint && bun run format:check` (parallel with Typecheck)
3. **Type Check** — `bun run typecheck` (parallel with Lint)
4. **Build** — `bun run build` (only after Lint + Typecheck both pass)
5. **Status Gate** — final aggregated pass/fail

## Docker

Build and run the production image locally (simplest):

```bash
docker compose up --build
# http://localhost:3000
```

Or build and run directly:

```bash
docker build -t agents-datum-net:local .
docker run --rm -p 3000:3000 agents-datum-net:local
```

To tag a specific version (e.g. for CI):

```bash
docker build --build-arg VERSION=$(git rev-parse --short HEAD) -t agents-datum-net:local .
```

The image uses Debian (not Alpine), runs as a non-root `datum` user (UID 1001), and includes a `HEALTHCHECK` against `GET /`. Dev dependencies are pruned during the build stage so the final image contains only production deps.

## Project structure

```
app/
├── root.tsx              HTML shell + ThemeProvider + global meta
├── routes/
│   └── _index.tsx        Homepage placeholder
├── lib/                  env, utils (cn re-exported from datum-ui)
└── styles/globals.css    Tailwind v4 + datum-ui tokens

Hono server: virtual default from `react-router-hono-server`. Materialize
with `bunx react-router-hono-server reveal file` when custom routes
(`/llms.txt`, `/manifest.json`, etc.) are needed in Phase 4.
```
