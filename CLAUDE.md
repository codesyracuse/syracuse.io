# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

syracuse.io is the front door to Syracuse's tech community: monthly meetups, a local Slack, and a monthly email. It's run by CODES, a 501(c)(3). The site is static Astro on Cloudflare Workers. The specs live in `docs/rebuild/` (`01-brief.md` first); where a spec and `docs/rebuild/reference/*.html` disagree, the spec wins.

## Commands

```bash
npm run build        # Build to ./dist/ (client output is dist/client)
npm run preview      # Serve the build locally at http://localhost:4321
npm run lint         # ESLint and Prettier check
npm run format       # Prettier --write
npm test             # Playwright: builds, previews, then runs unit + e2e
npx playwright test tests/e2e/home.spec.ts   # one file
npx playwright test --project=unit           # logic tests only, no browser
```

`npm run dev` works (it runs in workerd, like the build). Tests always build and preview rather than use the dev server; run them with `CI=true npm test` so Playwright starts its own server instead of reusing one on :4321. If dev shows `process is not defined`, that's Astro's logger hiding a real error inside workerd: run `astro dev logs` or build + preview to find it.

Playwright needs Chromium once: `npx playwright install chromium`.

Astro 7.4+ backgrounds `astro dev` and `astro preview` on its own when it detects an AI agent (`AI_AGENT`, `CLAUDECODE`). Agents should pass `--ignore-lock` to keep them in the foreground, and stop leftovers with `astro dev stop` / `astro preview stop`. The Playwright `webServer` command already does this.

## Architecture

### Rendering

`output: "static"`, prerendered in workerd (the adapter default) with the `nodejs_compat` flag in `wrangler.jsonc`, which the iCal parser needs. Images are optimized at build time (`imageService: "compile"`). Don't switch to `prerenderEnvironment: "node"`: it splits dev across two runtimes and breaks the `/_image` endpoint (`Could not import cloudflare:workers`). A daily CI run rebuilds and deploys so the next event, expiring jobs and expiring sponsors stay current without commits. URLs have no trailing slash or extension (`build.format: "file"`); use `cleanPath()` from `src/lib/site.ts` on `Astro.url.pathname`, which includes `.html` at build time.

### Events

Events come from iCal feeds listed in `src/config/events.ts`; adding Luma later means adding a line there. `src/lib/events/` is the pipeline: `parse.ts` (iCal to events), `dedupe.ts` (same Syracuse calendar day + normalized title, prefer the concrete numeric event id, manual entries win), `series-match.ts` (each series' `match` field), `index.ts` (fetch, merge, enrich, and the helpers pages use), `format.ts` (all date formatting, always `America/New_York`). A dead feed or non-calendar response throws and fails the build, so the previous deploy keeps serving. Pages never hardcode "Meetup"; the label comes from `PROVIDER_LABELS` by provider. RSVP links go through `rsvpUrl()`, which adds the UTM params.

Meetup's feed has no `LOCATION`; the venue comes from the event's series.

### Content (markdown, `src/content/`, schemas in `src/content.config.ts`)

| Collection | One file is                             | Notes                                                              |
| ---------- | --------------------------------------- | ------------------------------------------------------------------ |
| `series`   | a meetup series                         | Builds `/{slug}` only when `active: true`. Body is the page prose. |
| `venues`   | a place we meet                         | Not a directory.                                                   |
| `sponsors` | a host, event sponsor or annual partner | `start`/`end` windows; expired ones disappear at build.            |
| `jobs`     | a job                                   | Expires (default posted + 30 days); featured first.                |
| `photos`   | a photo                                 | Home shows the 4 newest; section hidden when empty.                |
| `events`   | a manual event                          | Overrides the feed for the same day and title.                     |

Date-only YAML values (`event_date: 2026-10-13`) parse as UTC midnight. Compare them with `calendarDay()` / `localDateKey()` from `lib/events/format.ts`, never as instants.

Anything with nothing to show renders nothing (no "0 jobs", no empty sections). Jobs is hidden from the nav when no job is active.

### Placeholders (`TBD(mike)`)

Facts only Mike can supply render as a visible placeholder via `<Tbd value label />` (or the literal string `TBD(mike)` in content and `src/lib/site.ts`). `src/integrations/build-guard.mjs` runs after every build: it always fails on an incomplete HTML page, and with `STRICT_TBD=1` it fails if any `TBD(mike)` remains. CI sets `STRICT_TBD=1` only for the production deploy, so previews can carry placeholders but production cannot.

### Analytics

`src/scripts/analytics.ts` loads GA4 and the Google Ads tag only when `PUBLIC_GA_MEASUREMENT_ID` / `PUBLIC_ADS_ID` are set at build time, after page load, and never when Do Not Track or Global Privacy Control is on. Conversions are `rsvp_click`, `slack_click`, `email_signup`, `sponsor_contact`, fired from `data-track` attributes (and any link to `/slack`). Ads labels come from `PUBLIC_ADS_CONVERSIONS`, JSON like `{"rsvp_click":"AW-123/abc"}`. In CI all three are GitHub repository variables, passed only to the production build. `src/scripts/email-form.ts` enhances the signup form (Buttondown, `EMAIL_FORM_ACTION` in `src/lib/site.ts`) and dispatches `syracuse:track`; tests must route `buttondown.com` so they never subscribe anyone. Keep `/privacy` in sync with whatever is loaded.

### Redirects and deploy

Exact redirects are in `astro.config.mjs` (`/slack` points at `SLACK_INVITE_URL` in `src/config/links.mjs`). Wildcards are in `public/_redirects`; the adapter appends its own rules to that file. `wrangler.jsonc` sets `not_found_handling: "404-page"`. CI (`.github/workflows/ci.yml`) lints, builds, tests, and deploys `dist/client/wrangler.json` on pushes to `main` and on a daily schedule. Same-repo pull requests upload a non-strict preview version (`--preview-alias pr-{number}`) and comment the preview URL on the PR. A `keepalive` job re-enables the workflow on each scheduled run, because GitHub disables schedules in public repos after 60 idle days.

### Styling

Tailwind 3 with color tokens as CSS variables in `src/styles/global.css` (`salt`, `ink`, `brick`, `steel`, `plow`, `card`, `line`, `muted`). `plow` is reserved for the `.io` in the wordmark and the day name in the hero date; don't use it elsewhere. No webfonts: system sans for prose, system monospace for data (dates, times, venues, nav, buttons, eyebrows). Light mode only.

`/sponsor` doubles as the printable sponsorship packet. The `@media print` block in `global.css` hides navigation, turns the dark bands light and keeps `.tier` cards whole; a link with `data-print-url` prints that URL after itself. The community numbers on `/codes` and `/sponsor` are `COMMUNITY_STATS` in `src/lib/site.ts`, rounded down with an "as of" month; bump them by hand.

## Gotchas

- If you delete the **last** file in a content folder, also delete `node_modules/.astro/data-store.json`; otherwise the old entry lingers locally (CI is unaffected).
- Astro trims whitespace at line breaks next to inline elements; use `{" "}` where Prettier splits a sentence around a link or component.
- Keep `@astrojs/cloudflare` current with Astro's minor version. Adapter 14.1 under Astro 7.4 silently stopped emitting build-time images, so `<Image>` pointed at `/_image`, which 404s on this static deploy. A home test checks that the photo is a built `/_astro/*.webp` file that loads.
- Tailwind 3 can't apply opacity modifiers to the CSS-variable colors (`bg-salt/10` fails); write the `rgb()` in CSS.

## Adding things

- **A series:** add `src/content/series/{slug}.md` (copy `open-hack.md`) and, if it meets somewhere new, a `venues` file. Set `match` so feed events are assigned to it. It gets its own page at `/{slug}` and a card on home.
- **A host or sponsor:** add `src/content/sponsors/{slug}.md`; set `kind`, and `event_date` for an event sponsor.
- **A job:** add `src/content/jobs/{slug}.md` with `title`, `company`, `location`, `url`, `posted`, `featured`.
