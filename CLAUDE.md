# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Syracuse.io is an Astro-based website (SSR, Cloudflare adapter) that serves as a consolidated directory and calendar for tech user groups and meetups in the Syracuse, NY area. It also surfaces a job board via an external API.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:4321
npm run build        # Build for production (outputs to ./dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint and Prettier check
npm run format       # Auto-fix formatting with Prettier
npm test             # Run Playwright E2E tests (auto-starts dev server)
npm run test:ui      # Playwright in interactive UI mode
npm run fetch-events # Scrape Meetup.com and update src/data/events.json
```

To run a single Playwright test file:
```bash
npx playwright test tests/e2e/groups.spec.ts
```

Playwright requires Chromium to be installed before first test run:
```bash
npx playwright install chromium
```

## Architecture

### Rendering model
The site uses Astro's SSR output mode with the Cloudflare adapter. Individual pages can opt into static prerendering with `export const prerender = true` — most pages do this since the data doesn't change at request time.

### Data flow

**Events** — `src/data/events.json` is the source of truth for Meetup events. It's a static JSON file committed to the repo and updated by running `npm run fetch-events`. That script (`scripts/fetch-meetup-events.mjs`) uses Playwright to scrape Meetup.com (no API key required). Scraped events are merged with existing data so historical events are preserved. The `src/lib/meetup.ts` module reads this file and exposes filtering/sorting helpers used by pages and components.

**Groups** — defined as Markdown files in `src/content/groups/*.md` using Astro content collections (schema in `content_config.ts`). Each group has a `groupId` field that links it to events in `events.json`. The `classifyEvent()` function in the fetch script maps event titles to `groupId` values — keep these in sync when adding groups.

**Jobs** — fetched at runtime from `https://jobs.syracuse.io/jobs.json` via `src/lib/jobkit.ts`. No local cache; Cloudflare handles edge caching.

### Key relationships
- `src/content/groups/{name}.md` → defines a group with `groupId`
- `src/data/events.json` → each event has a `groupId` matching a group file
- `src/pages/groups/[groupId].astro` → dynamic group detail page, uses `getStaticPaths()` from the content collection
- `src/components/GroupCards.astro` → grid on `/groups`, sorts by most recent event date using `getMostRecentEventDate(groupId)`

### Layouts
- `BaseLayout.astro` — HTML shell with nav, footer, fonts
- `Page.astro` — content wrapper supporting hero images, breadcrumbs, title, and a `wide` prop for wider content areas. Most pages use this.

### Styling
Tailwind CSS with the Typography plugin (`prose` classes for Markdown-rendered content). Dark mode is supported via `dark:` variants.

## Adding a New Group

1. Create `src/content/groups/{slug}.md` with frontmatter: `title`, `group`, `imagePath`, `summary`, `imgAlt`, `groupType`, `groupId`
2. Add the group image to `src/assets/groups/`
3. Add a classification rule in `classifyEvent()` in `scripts/fetch-meetup-events.mjs` so future scraped events get the correct `groupId`
