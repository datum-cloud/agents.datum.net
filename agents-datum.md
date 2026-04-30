# Project Brief — agents.datum.net

> **Reference Issue:** [datum-cloud/datum.net#1201 — Agentic subdomain design](https://github.com/datum-cloud/datum.net/issues/1201)
> **Document Purpose:** Source of truth for engineers and AI coding agents (Cursor) building this project. Read end-to-end before writing any code.
> **Last Updated:** 2026-04-30

---

## 1. Project Summary

### 1.1 What we are building

A new public website at **`agents.datum.net`** — a dedicated subdomain whose explicit purpose is to communicate what Datum is and what it does, in a format that is **simultaneously and equally legible to AI agents and to humans**.

This is a small, focused, content-driven website. It is not an application. It does not have authentication, user accounts, dashboards, or dynamic data from internal APIs. The hardest engineering problem here is not complexity — it is achieving genuine **agent readability** while remaining visually compelling for humans.

### 1.2 Why we are building it

Datum is positioning itself as cloud infrastructure for the agentic era. To prove that commitment is real and not marketing, we are building a public surface where the medium itself reflects the message: clean, structured, machine-parseable, and human-readable in equal measure.

The site must work as a **proof of concept** — when a developer points an AI agent at `agents.datum.net`, the agent should be able to extract a complete and accurate understanding of Datum without needing to execute JavaScript, scroll past hero animations, or parse marketing copy. A human visiting should get the same content, structured beautifully.

### 1.3 Inspiration & references

- **Primary visual reference:** [atg.science](https://atg.science/) — numbered sections, dense typography-led layout, near-zero visual ornamentation, content as the entire UI.
- **Primary navigation reference:** Tigris's two-domain navigation pattern (referenced in the issue screenshot) — clear, persistent linking between the main site and the agent-facing site.
- **Standard reference:** [llmstxt.org](https://llmstxt.org) — emerging convention for `/llms.txt`, an LLM-readable summary file at the root of a domain.

---

## 2. Goals & Non-Goals

### 2.1 Goals (in priority order)

| #   | Goal                                                                               | Priority |
| --- | ---------------------------------------------------------------------------------- | -------- |
| G1  | Communicate what Datum does to agents and humans with equal clarity                | P0       |
| G2  | Establish a clean, minimal design language that becomes Datum's agentic identity   | P0       |
| G3  | Provide seamless bidirectional navigation between `datum.net` ↔ `agents.datum.net` | P0       |
| G4  | Be fully parseable by LLM agents without JavaScript execution                      | P0       |
| G5  | Serve as the foundation/template for future agent-facing Datum surfaces            | P1       |
| G6  | Ship as a maintainable codebase consistent with `datum-cloud/cloud-portal`         | P1       |

### 2.2 Non-Goals

The following are explicitly **not** part of this project:

- This is not a replacement for `datum.net`. The main marketing site remains untouched (other than adding a single navigation link to the new subdomain).
- This is not a product portal. That is `cloud.datum.net` (the existing `cloud-portal` repo).
- This is not a documentation site. Documentation lives elsewhere and is out of scope.
- This is not a blog, changelog, or news outlet.
- This is not an interactive demo or playground.
- No authentication. No user accounts. No sessions. No personalization.
- No dynamic data fetching from Datum's internal APIs in v1.
- No analytics in v1 (can be added later with proper consent).
- No internationalization in v1.

---

## 3. Tech Stack

The boss has explicitly directed that the stack must align with **[`datum-cloud/cloud-portal`](https://github.com/datum-cloud/cloud-portal)**. This is the single most important constraint on technology choice.

### 3.1 Stack table

| Layer            | Technology      | Version constraint     | Notes                                          |
| ---------------- | --------------- | ---------------------- | ---------------------------------------------- |
| Framework        | React Router v7 | `^7.x`                 | Full-stack with SSR. SSR is mandatory — see §6 |
| Server           | Hono            | latest stable          | Same as cloud-portal                           |
| UI components    | shadcn/ui       | latest                 | Headless, copied into repo (not installed)     |
| Styling          | Tailwind CSS    | v4                     | Match cloud-portal's Tailwind v4 setup         |
| Icons            | lucide-react    | latest                 | Already used by shadcn/ui                      |
| Language         | TypeScript      | strict mode            | 100% TypeScript, no `.js` files in `app/`      |
| Package manager  | Bun             | match `.tool-versions` | Single source of truth via `.tool-versions`    |
| Build            | Vite            | latest                 | Standard React Router v7 setup                 |
| Linting          | ESLint          | flat config            | Copy `eslint.config.mjs` from cloud-portal     |
| Formatting       | Prettier        | latest                 | Copy `prettier.config.mjs` from cloud-portal   |
| Git hooks        | Lefthook        | latest                 | Copy `lefthook.yml` from cloud-portal          |
| Containerization | Docker          | —                      | Production `Dockerfile` + `docker-compose.yml` |
| E2E testing      | Cypress         | latest                 | Smoke tests for navigation and agent endpoints |
| Renovate         | Renovate config | —                      | Copy `renovate.json` from cloud-portal         |

### 3.2 What we are NOT using and why

- **Astro** — even though `datum.net` uses Astro, the boss requires alignment with `cloud-portal`. React Router v7 SSR satisfies all agent-readability requirements.
- **Next.js** — not in Datum's standard stack. Avoid.
- **TanStack Query** — present in `cloud-portal` but unnecessary here. We have no client-side data fetching.
- **OpenAPI client generation** — present in `cloud-portal` but unnecessary here. We don't consume Datum APIs.
- **Authentication libraries** — none needed.
- **State management libraries (Redux, Zustand, etc.)** — none needed. Use React state for local UI only.

### 3.3 Cursor agent guidance: when scaffolding

When scaffolding the project, Cursor should:

1. Pull configuration files (`eslint.config.mjs`, `prettier.config.mjs`, `lefthook.yml`, `renovate.json`, `tsconfig.json`, `.tool-versions`, `.nvmrc`, `.prettierignore`) from `cloud-portal` as starting points and adapt only what is necessary.
2. Use the same Bun + Vite + React Router v7 toolchain configuration.
3. Initialize shadcn/ui via its CLI and configure `components.json` consistently with `cloud-portal`.
4. Not invent new patterns — when in doubt, mirror `cloud-portal`.

---

## 4. Information Architecture

### 4.1 Sitemap

```
agents.datum.net/
├── /                    Homepage (single-page, all content)
├── /llms.txt            Plain text agent context file
├── /manifest.json       Machine-readable site manifest
├── /robots.txt          Allow all crawlers
└── /sitemap.xml         Auto-generated sitemap
```

**v1 is intentionally a single-page site.** Additional routes (e.g. `/capabilities`, `/principles`) can be added in v1.1 if content demands it. Do not over-engineer routing for content that doesn't exist yet.

### 4.2 Homepage section structure

The homepage follows the `atg.science` pattern: numbered sections, sequential, content-dense. Each section has a stable anchor ID that agents can deep-link to.

| #   | Section      | Anchor          | Purpose                                              |
| --- | ------------ | --------------- | ---------------------------------------------------- |
| 00  | Header       | —               | Datum wordmark + nav back to `datum.net`             |
| 01  | What         | `#what`         | One paragraph: what is Datum?                        |
| 02  | Why          | `#why`          | The problem Datum solves, for both agents and humans |
| 03  | How          | `#how`          | How Datum works — infrastructure primitives          |
| 04  | Capabilities | `#capabilities` | Structured list of core capabilities                 |
| 05  | For Agents   | `#agents`       | Why Datum is built for the agentic era               |
| 06  | Get Started  | `#start`        | CTAs: portal, docs, contact                          |
| 07  | Footer       | —               | Link back to `datum.net`, legal, address             |

> **Final copy is pending** — see [the reference Google Doc linked in the issue](https://docs.google.com/document/d/1jBZ5413R7H0UJLt6dyUQwt2aZAvnyHLWxecQvZNFsws/edit?usp=sharing). For initial scaffolding, use the section headers above with placeholder copy clearly marked `// TODO: final copy from kaleygel`.

---

## 5. Design Specification

### 5.1 Visual philosophy

- **Typography is the primary visual element.** No hero images. No illustrations. No gradients. No animated blobs. No video backgrounds.
- **Numbered sections.** Each major section is prefixed with a two-digit number (`01`, `02`, …). This is both a visual signature and a semantic structure for agents.
- **Single column, reading-optimized.** Maximum content width ~720px on desktop. The site reads like a well-typeset technical document.
- **Light & dark mode.** Both required. Default theme is **light**. Theme follows the user's operating system preference via `prefers-color-scheme`; if the OS expresses no preference (or prefers light), the page renders light. Dark only activates when the OS explicitly prefers dark. **No manual toggle in v1.**
- **Restraint over decoration.** When a design choice could be either "more" or "less," choose less.

### 5.2 Design tokens (proposed — confirm with design)

```css
/* Typography */
--font-sans: 'Geist', 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;

/* Type scale */
--text-xs: 0.75rem; /* 12px — section numbers, small meta */
--text-sm: 0.875rem; /* 14px — captions */
--text-base: 1rem; /* 16px — body */
--text-lg: 1.125rem; /* 18px — emphasized body */
--text-xl: 1.5rem; /* 24px — section titles */
--text-2xl: 2rem; /* 32px — page title */
--leading-body: 1.6;
--leading-heading: 1.2;

/* Spacing — 8px base grid */
--space-1: 0.5rem; /* 8px */
--space-2: 1rem; /* 16px */
--space-3: 1.5rem; /* 24px */
--space-4: 2rem; /* 32px */
--space-5: 3rem; /* 48px */
--space-6: 4rem; /* 64px */
--space-7: 6rem; /* 96px */

/* Color — light */
--bg: #ffffff;
--fg: #0a0a0a;
--fg-muted: #6b6b6b;
--border: #e5e5e5;
--accent: #0066ff; /* sparingly used */

/* Color — dark */
--bg-dark: #0a0a0a;
--fg-dark: #ededed;
--fg-muted-dark: #9a9a9a;
--border-dark: #1f1f1f;
--accent-dark: #4d8cff;

/* Layout */
--content-max-width: 720px;
--page-padding-x: clamp(1.25rem, 5vw, 3rem);
```

These tokens must live in `app/styles/globals.css` as CSS variables and be wired to Tailwind v4 via `@theme` for utility class generation. Match the same token-driven approach used by `cloud-portal`.

### 5.3 Component-level conventions

- **Section number component (`<SectionNumber n="01" />`)** — renders the two-digit number in monospace, small, muted color, positioned consistently above each section's heading.
- **All headings semantic.** Page has exactly one `<h1>`. Section titles are `<h2>`. Subheadings inside sections are `<h3>`. No skipping levels.
- **Links underlined by default** in body copy (or use a clear visual affordance). Don't rely on color alone.
- **Buttons via shadcn/ui.** Use the `<Button>` primitive with project theme.
- **No inline styles.** Tailwind utility classes only. Custom CSS only in `globals.css` for tokens and base resets.

### 5.4 Responsive behavior

- **Mobile-first.** Design for 375px width, then scale up.
- Single column at all breakpoints. Tighten padding on small screens.
- Section numbers shrink slightly on mobile but remain legible.
- No horizontal scroll, ever.

### 5.5 Accessibility (WCAG 2.1 AA, non-negotiable)

- Color contrast ≥ 4.5:1 for body, ≥ 3:1 for large text — verify in both light and dark modes.
- All interactive elements keyboard navigable; visible focus rings (do not remove default outline without replacement).
- `lang="en"` on `<html>`.
- Skip-to-content link as the first focusable element.
- All icon-only buttons have `aria-label`.
- Respect `prefers-reduced-motion` if any motion is added later.

### 5.6 Theme implementation

The theme is driven by `@datum-cloud/datum-ui`'s class-based theme system, which is the same approach used in `cloud-portal` and aligns with the brief's stack constraint.

- **Datum design tokens.** Light token values live at `:root`; dark token values live at `.dark` (both shipped by `@datum-cloud/datum-ui/styles`). Tailwind v4's `dark` variant in datum-ui is defined as `@custom-variant dark (&:is(.dark *))`, so the `.dark` class on `<html>` is the single switch.
- **System-preference, no toggle.** `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` reads the user's OS `prefers-color-scheme` and toggles `.dark` on `<html>`. No toggle UI is rendered. Default is light when the OS expresses no preference.
- **No FOUC.** `<ThemeScript />` (from `@datum-cloud/datum-ui/theme`) emits an inline blocking script in `<head>` that resolves the theme and applies the class **before** React hydrates, so the first paint matches the OS preference exactly.
- **Native UA chrome follows OS too.** `<html style="color-scheme: light dark">` plus paired `<meta name="theme-color">` tags scoped via `media="(prefers-color-scheme: light|dark)"` keep scrollbars, form controls, autofill, and the mobile URL bar consistent with the active theme.
- **`suppressHydrationWarning` on `<html>`.** SSR returns no `.dark` class (the server doesn't know the user's OS); the inline script may add it before hydration. This single attribute tells React to ignore the expected mismatch on the root element.

This pattern aligns with cloud-portal's root.tsx, ensures zero flash, and gives us the full datum-ui component library out of the box without inventing a parallel token system.

---

## 6. Agent Readability Requirements

This section is the **most important technical part of the brief**. The site must be readable by AI agents that do not execute JavaScript.

### 6.1 Hard requirements

| #    | Requirement                                                   | Implementation                                                                                                       |
| ---- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| AR1  | All primary content rendered in server HTML                   | React Router v7 SSR. Zero content loaded by client-side fetch in v1                                                  |
| AR2  | Semantic HTML                                                 | `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<h1>`–`<h3>` used correctly                    |
| AR3  | One `<h1>` per page                                           | Page title is the single `<h1>`. Section titles are `<h2>`                                                           |
| AR4  | Stable anchor IDs on every section                            | E.g. `<section id="capabilities">`. Used by agents for deep-linking                                                  |
| AR5  | Open Graph + Twitter meta tags                                | `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `twitter:card`                                        |
| AR6  | JSON-LD structured data                                       | `<script type="application/ld+json">` containing `Organization` and `WebSite` schemas                                |
| AR7  | `/llms.txt` endpoint                                          | Plain text, served with `Content-Type: text/plain; charset=utf-8`. Follows [llmstxt.org](https://llmstxt.org) format |
| AR8  | `/manifest.json` endpoint                                     | JSON describing the site, served with `Content-Type: application/json`                                               |
| AR9  | `/robots.txt` permissive                                      | Allow all known crawlers, explicitly allow GPTBot, ClaudeBot, PerplexityBot, etc.                                    |
| AR10 | `/sitemap.xml`                                                | Auto-generated, lists all routes                                                                                     |
| AR11 | No critical content behind hover, modal, or click-only reveal | Everything important must be in initial HTML                                                                         |
| AR12 | Logical reading order in DOM                                  | DOM order matches visual reading order on every breakpoint                                                           |

### 6.2 `/llms.txt` format (target)

A handwritten, plain-text overview of Datum aimed at LLM agents. Initial template:

```
# Datum

> Datum is a cloud infrastructure platform built for the agentic era.

## What is Datum

Datum provides cloud infrastructure primitives — DNS, networking, compute, access control —
designed to be operated by both humans and autonomous agents through a unified API.

## Where to find what

- Main marketing site: https://datum.net
- Agentic overview (this surface): https://agents.datum.net
- Cloud portal (manage resources): https://cloud.datum.net
- Documentation: https://docs.datum.net
- API reference: [link]
- Source: https://github.com/datum-cloud

## Capabilities

- DNS management
- Networking (HTTP proxies, load balancers, network policies)
- Compute resources
- Organization and project management
- Role-based access control
- Real-time updates via Kubernetes Watch API

## How agents interact with Datum

[describe API access patterns, auth, MCP server availability if applicable]
```

The exact final content will be authored by `@kaleygel`. Engineers should ship a working endpoint with this template content as a placeholder.

### 6.3 `/manifest.json` schema

```json
{
  "name": "Datum",
  "tagline": "Cloud infrastructure for the agentic era",
  "url": "https://agents.datum.net",
  "description": "...",
  "links": {
    "main_site": "https://datum.net",
    "portal": "https://cloud.datum.net",
    "docs": "https://docs.datum.net",
    "github": "https://github.com/datum-cloud",
    "llms_txt": "https://agents.datum.net/llms.txt"
  },
  "capabilities": ["dns", "networking", "compute", "access-control", "project-management"],
  "contact": {
    "email": "..."
  },
  "version": "1.0.0"
}
```

### 6.4 `/robots.txt`

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://agents.datum.net/sitemap.xml
```

### 6.5 JSON-LD example

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Datum",
    "url": "https://datum.net",
    "sameAs": ["https://agents.datum.net", "https://github.com/datum-cloud"],
    "description": "Cloud infrastructure for the agentic era."
  }
</script>
```

---

## 7. Bidirectional Navigation

A core deliverable per the issue: agents and humans must be able to move between `datum.net` and `agents.datum.net` seamlessly.

### 7.1 From `agents.datum.net` → `datum.net`

- **Header:** small, persistent link in the top-left or top-right: `← datum.net`
- **Footer:** explicit link with label: `Main website: datum.net`
- Both links use full URLs (not relative paths) since these are different subdomains.

### 7.2 From `datum.net` → `agents.datum.net`

This requires a **separate change in the [`datum-cloud/datum.net` Astro repo](https://github.com/datum-cloud/datum.net)**, not in this new repo. Plan:

- Add a small link in the global navigation or site footer of `datum.net`: `For agents → agents.datum.net`
- Style it as a secondary nav item or pill — unobtrusive but visible.
- This is a separate PR scoped to the existing `datum.net` repo and **not included in v1 of `agents.datum.net`** but must be tracked as a sibling task.

### 7.3 Pattern reference

The screenshot in the issue (Tigris) shows a horizontal top strip linking the two domains. Implement the same pattern in spirit: a clear, persistent affordance — not buried in a hamburger menu.

---

## 8. Folder Structure

Mirror `cloud-portal` conventions. Group by feature, not by file type.

```
agents-datum-net/
├── .claude/                         # Optional Claude/Cursor config
├── .devcontainer/                   # Optional, copy from cloud-portal if used
├── .github/
│   └── workflows/
│       ├── ci.yml                   # lint, typecheck, test, build
│       └── deploy.yml               # build + deploy to staging/production
├── .vscode/                         # Editor config (copy from cloud-portal)
├── app/
│   ├── root.tsx                     # Root document, head tags, JSON-LD
│   ├── routes/
│   │   ├── _index.tsx               # Homepage (single page with all sections)
│   │   ├── llms[.txt].tsx           # /llms.txt — text/plain
│   │   ├── manifest[.json].tsx      # /manifest.json — application/json
│   │   ├── robots[.txt].tsx         # /robots.txt
│   │   └── sitemap[.xml].tsx        # /sitemap.xml
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Top nav with link back to datum.net
│   │   │   ├── Footer.tsx
│   │   │   └── SectionNumber.tsx    # Numbered "01", "02" component
│   │   ├── sections/
│   │   │   ├── WhatSection.tsx
│   │   │   ├── WhySection.tsx
│   │   │   ├── HowSection.tsx
│   │   │   ├── CapabilitiesSection.tsx
│   │   │   ├── AgentsSection.tsx
│   │   │   └── StartSection.tsx
│   │   └── ui/                      # shadcn/ui components (Button, Badge, etc.)
│   ├── lib/
│   │   ├── env.ts                   # Type-safe env var access
│   │   ├── seo.ts                   # Helpers for meta tags, JSON-LD
│   │   ├── llms-txt.ts              # /llms.txt content generator
│   │   ├── manifest.ts              # /manifest.json content generator
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css              # Tailwind base + design tokens
│   └── entry.server.tsx             # SSR entry
├── config/                          # If shared config files needed
├── cypress/
│   └── e2e/
│       ├── homepage.cy.ts
│       ├── navigation.cy.ts
│       └── agent-endpoints.cy.ts    # /llms.txt, /manifest.json, /robots.txt
├── public/
│   └── favicon.ico
├── docs/
│   └── README.md                    # Developer onboarding
├── .dockerignore
├── .env.example
├── .gitignore
├── .nvmrc
├── .prettierignore
├── .tool-versions
├── CHANGELOG.md
├── Dockerfile                       # Multi-stage, production-ready
├── README.md
├── bun.lock
├── components.json                  # shadcn/ui config
├── cypress.config.ts
├── docker-compose.yml
├── eslint.config.mjs
├── lefthook.yml
├── package.json
├── prettier.config.mjs
├── react-router.config.ts
├── renovate.json
├── tsconfig.json
└── vite.config.ts
```

---

## 9. Environment Variables

All configuration via env vars. Nothing hardcoded. Provide a `.env.example`:

```env
# .env.example

# === Public (exposed to client via Vite) ===
VITE_APP_URL=https://agents.datum.net
VITE_MAIN_SITE_URL=https://datum.net
VITE_PORTAL_URL=https://cloud.datum.net
VITE_DOCS_URL=https://docs.datum.net
VITE_GITHUB_ORG_URL=https://github.com/datum-cloud

# === Server-only ===
NODE_ENV=development
PORT=3000

# === Optional analytics (v1.1+) ===
# VITE_PLAUSIBLE_DOMAIN=
```

Type-safe access via `app/lib/env.ts` with runtime validation (use `zod` if not already a transitive dep — otherwise, hand-roll a lightweight validator).

---

## 10. Performance Targets

| Metric                       | Target   |
| ---------------------------- | -------- |
| Lighthouse Performance       | ≥ 95     |
| Lighthouse Accessibility     | ≥ 95     |
| Lighthouse Best Practices    | ≥ 95     |
| Lighthouse SEO               | 100      |
| LCP                          | < 1.5s   |
| FID / INP                    | < 100ms  |
| CLS                          | < 0.05   |
| Initial JS bundle (gzipped)  | < 50 KB  |
| Initial CSS bundle (gzipped) | < 15 KB  |
| Total page weight (initial)  | < 150 KB |

These are achievable for a static-content SSR site. If a target is missed, do not hide JS by deferring — fix the root cause (oversized fonts, unused dependencies, hydration of static content, etc.).

---

## 11. CI/CD

Copy structure from `cloud-portal`'s `.github/workflows`.

### 11.1 Pipeline steps (in order)

1. **Install dependencies** (`bun install --frozen-lockfile`)
2. **Lint** (`bun run lint`)
3. **Typecheck** (`bun run typecheck`)
4. **Build** (`bun run build`)
5. **E2E tests** (Cypress, against built output)
6. **Build Docker image**
7. **Deploy** (only on protected branches)

### 11.2 Branching & environments

| Branch                       | Environment        | URL                        |
| ---------------------------- | ------------------ | -------------------------- |
| Feature branches → `develop` | Preview (optional) | —                          |
| `develop`                    | Staging            | `agents-staging.datum.net` |
| `main`                       | Production         | `agents.datum.net`         |

### 11.3 Releases

- Use **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `ci:`).
- Tag releases with **semantic versioning**: `v0.1.0`, `v0.2.0`, `v1.0.0`.
- Generate `CHANGELOG.md` on release (script or release-please — match cloud-portal).

### 11.4 Health check

The deployed container must respond to `GET /` with HTTP 200. Use this for orchestrator health checks. Zero-downtime deployment preferred (rolling update).

---

## 12. Testing Strategy

The site is small and content-driven, so testing scope is narrow but strict.

### 12.1 What to test

- **E2E (Cypress) — required:**
  - Homepage renders with all 6 sections present
  - All section anchor links work (`#what`, `#why`, etc.)
  - Header link to `datum.net` is present and points to correct URL
  - Footer link to `datum.net` is present
  - `/llms.txt` returns 200 with `Content-Type: text/plain`
  - `/manifest.json` returns 200 with valid JSON and required keys
  - `/robots.txt` returns 200 and includes `Sitemap:` directive
  - `/sitemap.xml` returns 200 with valid XML

- **Unit tests — light:**
  - `app/lib/seo.ts` helpers (if non-trivial)
  - `app/lib/llms-txt.ts` content generator

- **No tests required for:** styling, layout, design tokens (visual regression is tracked manually via Lighthouse + design review).

### 12.2 What good looks like

CI pipeline must complete in under 5 minutes. All tests must pass before merge to `develop` or `main`.

---

## 13. Deliverables Checklist

A v1 release is considered done when **all** of the following are complete:

- [ ] Repository scaffolded with stack from §3, structure from §8
- [ ] Homepage renders all sections from §4.2 with placeholder copy
- [ ] Light + dark mode functional via system preference; light is the default when no OS preference is set (no toggle)
- [ ] Mobile-first responsive at 375px, 768px, 1024px, 1440px breakpoints
- [ ] `/llms.txt` live with §6.2 template content
- [ ] `/manifest.json` live with §6.3 schema
- [ ] `/robots.txt` live with §6.4 content
- [ ] `/sitemap.xml` auto-generated
- [ ] JSON-LD structured data on homepage
- [ ] Open Graph + Twitter meta tags on homepage
- [ ] Header link `← datum.net` present
- [ ] Footer link to `datum.net` present
- [ ] All performance targets (§10) met on Lighthouse
- [ ] All accessibility checks pass (WCAG 2.1 AA)
- [ ] CI pipeline green (lint, typecheck, build, test)
- [ ] Production Dockerfile builds and runs locally
- [ ] `.env.example` complete and accurate
- [ ] `README.md` with setup, dev, build, deploy instructions
- [ ] Cypress E2E tests passing for all checks in §12.1
- [ ] Verified by feeding `agents.datum.net` URL to ChatGPT/Claude/Perplexity — they correctly summarize what Datum does

---

## 14. Open Questions

These need resolution before or during build. Not blocking initial scaffolding.

| #   | Question                                                                                                | Owner         | Status                                   |
| --- | ------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------- |
| Q1  | Final copy for each homepage section                                                                    | @kaleygel     | Pending — see Google Doc in issue        |
| Q2  | Confirmed font choice (Geist? Inter? something else?)                                                   | Design        | Pending                                  |
| Q3  | Final color tokens — specifically the accent color                                                      | Design        | Pending                                  |
| Q4  | Standalone repo or live in monorepo with `datum.net`?                                                   | Eng lead      | Resolved — standalone repo (this one)    |
| Q5  | DNS configuration for `agents.datum.net` subdomain                                                      | DevOps        | Pending                                  |
| Q6  | Should `/llms.txt` be hand-authored or generated from a CMS?                                            | Eng + content | Pending — recommend hand-authored for v1 |
| Q7  | Will Datum publish an MCP server? Should `/llms.txt` reference it?                                      | Product       | Pending                                  |
| Q8  | Hosting target — Cloudflare? Same provider as `cloud-portal`?                                           | DevOps        | Pending                                  |
| Q9  | What email address should appear in `/manifest.json` contact?                                           | @kaleygel     | Pending                                  |
| Q10 | Add a separate PR to `datum.net` Astro repo for the inbound link to `agents.datum.net` — who owns that? | Eng lead      | Pending                                  |

---

## 15. Implementation Phases (suggested execution order for Cursor)

A recommended sequence for an AI coding agent or engineer building this:

### Phase 1: Foundation (Day 1)

1. Scaffold project with React Router v7 + Bun + Vite per `cloud-portal` patterns
2. Copy and adapt config files from `cloud-portal` (`eslint.config.mjs`, `prettier.config.mjs`, `lefthook.yml`, `tsconfig.json`, etc.)
3. Configure Tailwind v4 with design tokens from §5.2
4. Set up shadcn/ui via CLI, install `Button` primitive
5. Create `app/lib/env.ts` with type-safe env var access
6. Verify `bun run dev` works and renders an empty page

### Phase 2: Layout & components (Day 2)

7. Build `Header.tsx` with link back to `datum.net`
8. Build `Footer.tsx` with full link list
9. Build `SectionNumber.tsx` component
10. Build `root.tsx` with HTML structure, meta tags, and JSON-LD slot
11. Build `app/lib/seo.ts` helpers

### Phase 3: Homepage content (Day 3)

12. Build all six section components (`WhatSection`, `WhySection`, etc.) with placeholder copy
13. Compose them into `_index.tsx`
14. Verify semantic HTML, single `<h1>`, correct heading hierarchy
15. Verify light + dark render correctly when toggling OS theme; no toggle UI in v1

### Phase 4: Agent endpoints (Day 4)

16. Implement `/llms.txt` route with template content from §6.2
17. Implement `/manifest.json` route with schema from §6.3
18. Implement `/robots.txt` route with content from §6.4
19. Implement `/sitemap.xml` route (auto-generated)
20. Add JSON-LD `Organization` schema to homepage

### Phase 5: Quality & deploy (Day 5)

21. Write Cypress E2E tests (§12.1)
22. Run full Lighthouse audit, fix anything below targets in §10
23. Manually verify with ChatGPT/Claude/Perplexity
24. Write production `Dockerfile` and `docker-compose.yml`
25. Set up CI workflow (`.github/workflows/ci.yml`)
26. Set up deploy workflow (`.github/workflows/deploy.yml`)
27. Write `README.md`

### Phase 6: Launch tasks (separate)

28. Configure DNS for `agents.datum.net`
29. Open separate PR on `datum-cloud/datum.net` to add link from main site (§7.2)
30. Final content swap from `@kaleygel`'s copy

---

## 16. References

- **Issue:** [datum-cloud/datum.net#1201](https://github.com/datum-cloud/datum.net/issues/1201)
- **Stack reference:** [datum-cloud/cloud-portal](https://github.com/datum-cloud/cloud-portal)
- **Main site repo:** [datum-cloud/datum.net](https://github.com/datum-cloud/datum.net)
- **Design reference:** [atg.science](https://atg.science/)
- **`/llms.txt` standard:** [llmstxt.org](https://llmstxt.org)
- **React Router v7:** [reactrouter.com](https://reactrouter.com)
- **Hono:** [hono.dev](https://hono.dev)
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind v4:** [tailwindcss.com](https://tailwindcss.com)
- **Reference content for copy:** [Google Doc linked in issue](https://docs.google.com/document/d/1jBZ5413R7H0UJLt6dyUQwt2aZAvnyHLWxecQvZNFsws/edit?usp=sharing)

---

## 17. Notes for the Cursor agent

When working on this project:

- **Stack alignment with `cloud-portal` is the highest-priority constraint.** When in doubt, look at how `cloud-portal` does it and do the same.
- **SSR is non-negotiable.** Do not introduce client-side data fetching for primary content in v1.
- **Do not over-engineer.** This is a content site, not an application. Resist the urge to add abstractions until they're justified.
- **Do not invent copy.** Where final content is pending, use clearly marked `// TODO: copy from kaleygel` placeholders.
- **Ask before scope-creeping.** If a feature seems valuable but isn't in this brief, flag it as a question — don't just build it.
- **Conventional Commits required.** Every commit message follows `<type>: <description>` format.
- **One concern per PR.** If a PR is touching unrelated areas, split it.
- **No hardcoded URLs.** Every external URL goes through env vars (§9).
- **Test agent readability.** Before marking the project done, paste `agents.datum.net` into ChatGPT/Claude/Perplexity and verify the agent can summarize it correctly. This is the most important success criterion.
