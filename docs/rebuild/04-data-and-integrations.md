# Data and integrations

Stack: Astro (static output) on Cloudflare Workers, same as the current repo. Content lives in Astro content collections as markdown with frontmatter.

## Content collections

### `series`
```yaml
# src/content/series/open-hack.md
slug: open-hack
name: Open Hack
active: true
rhythm: "Second Tuesday, every month"
since: "2014-04"           # YYYY-MM; group-wide default, override per series
time: "6:00 pm"
venue: commonspace        # ref → venues
summary: "An unstructured evening of coding on whatever you want, next to other people who code."
match: "OpenHack"         # string/regex used to assign feed events to this series
seo_title: "Open Hack — a monthly developer meetup in Syracuse, NY"
seo_description: "..."
```
Body = the series page prose (What happens / Who it's for / First time).

### `venues` (only venues we actually meet at; not a directory)
```yaml
slug: commonspace
name: Commonspace
address: TBD(mike)
neighborhood: Downtown
maps_url: ...
notes: "Parking/entry notes"
```

### `sponsors`
```yaml
slug: commonspace
name: Commonspace
kind: host               # host | event | annual
logo: ./logos/commonspace.svg
url: https://...
series: [open-hack]      # optional; for hosts/event sponsors
event_date: 2026-10-13   # only for kind: event
start: 2026-10-01
end:   2027-09-30        # omit for open-ended hosts
```
Display rules:
- **Home "Thanks to":** all active `host` + `annual`.
- **Series page:** hosts for that series, plus the event sponsor for the next event if any.
- **Event row:** "Food by {name}" when an `event` sponsor matches that date.
- **Monthly email:** same data (future).
- Expired sponsors (past `end`) disappear automatically at build.

### `jobs`
```yaml
title: Senior Backend Engineer
company: Example Co
location: "Syracuse / hybrid"
url: https://...
posted: 2026-10-01
expires: 2026-10-31      # required; default posted + 30d
featured: true           # paid
source: slack            # slack | direct
```
Phase 1 is manual: Mike adds files (mirroring good #jobs posts with the poster's OK, plus paid featured roles). Expired jobs are excluded at build. If zero active jobs remain, hide Jobs from the nav and home.

Later (not v1): a Stripe Payment Link for featured posts, and possibly a Slack workflow that drafts a job file as a PR.

### `photos`
```yaml
src: ./photos/2026-09-open-hack-1.jpg
caption: "Open Hack · Sept 2026"
alt: "..."
date: 2026-09-08
```
Home shows the 5 most recent.

## Events feed (platform-agnostic)

Events come from **iCal feeds**, configured per provider in one file:

```ts
// src/config/events.ts
export const EVENT_FEEDS = [
  { provider: "meetup", url: "https://www.meetup.com/syracuse-software-development-meetup/events/ical/" },
  // later: { provider: "luma", url: "<Luma calendar .ics URL>" },
];
```

- Fetch and parse at build time (use `node-ical` or similar). Verify the Meetup iCal URL works; if it doesn't, fall back to whatever fetch the current repo uses, behind the same interface.
- Normalize to `{ id, title, start, end, location, url, provider, series }`.
- Assign `series` via each series' `match` field. Unmatched events show as "Community event."
- **Dedupe** on (local date + normalized title). Prefer the entry with a numeric/concrete event ID. (The relaunch preview showed the same Oct 13 Open Hack twice: once with a series-template URL, once with the concrete event URL.)
- Allow a manual `src/content/events/*.md` override/addition for events not on any platform.
- **Rebuild on a schedule** (daily cron via a Cloudflare deploy hook or GitHub Actions) so the next date stays current without commits.
- All "RSVP" links go to the event's platform URL. Pages never hardcode "Meetup."

## Redirects

`/slack` → current Slack invite URL (set in one config value; use a non-expiring invite). `/email` → `/#email`.

## Email signup

Inline form on home and in the footer. Provider is `TBD(mike)`; abstract it behind one component with a configurable form action. Double opt-in on. (The existing list was exported from Meetup and has never been mailed; the first send will be a re-permission email, which is outside this repo.)

## Analytics and conversion tracking (needed for Google Ad Grants)

- GA4 plus a Google Ads conversion tag. Load only after the page is interactive; respect Do Not Track. Document in `/privacy`.
- Conversions to fire:
  - `rsvp_click`: outbound click on any RSVP link (include `series` and `provider` params)
  - `slack_click`: click to `/slack`
  - `email_signup`: successful email form submit
  - `sponsor_contact`: click on the support mailto/CTA on `/codes`
- Add UTM params to outbound RSVP links (`utm_source=syracuse.io&utm_medium=site&utm_campaign={series}`).

## SEO

- One h1 per page; series pages include "Syracuse" and the series type in the title and h1.
- `Event` JSON-LD (schema.org) on series pages and home for upcoming events.
- `Organization` JSON-LD on `/codes` (nonprofit).
- Sitemap and a `robots.txt` that allows crawling.

## Quality bar

- Lighthouse 95+ on all four categories, mobile.
- Works with JavaScript disabled, except the email form enhancement.
- Total JS on home under 20 KB, excluding analytics.
