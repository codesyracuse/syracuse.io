# syracuse.io rebuild — brief

Read this first, then `02-pages.md`, `03-design.md`, `04-data-and-integrations.md`.
Visual reference: `reference/index.html` (home) and `reference/open-hack.html` (series page). Open them in a browser. Match their look and structure; where a reference page and a spec disagree, **the spec wins**.

## What this site is

syracuse.io is the front door to Syracuse's tech community: recurring meetups, a local Slack, and a monthly email. It's run by CODES (Coalition of Digital Engagement in Syracuse), a small 501(c)(3) whose working mission is **break even and connect people**. The meetups have run every month since **April 2014**.

The site has three jobs, in priority order:

1. **Prove consistency.** Show that this happens every month, reliably, and when the next one is. Consistency is the authority signal. Never describe the group as "small."
2. **Route people into a touch point.** RSVP to a meetup, join the Slack, or get the monthly email. Every page ends in one of these.
3. **Make supporting it easy.** Credit hosts and sponsors with dignity, sell featured job posts, and explain where money goes.

Audience: people who care about software and technology in and around Syracuse. That includes developers, but also students, career-switchers, designers, hobbyists, and the curious. Write for all of them.

## Principles

- **The schedule is the brand.** The next date is the hero, not a slogan.
- **Nothing that can look empty.** No stat counters, no directories, no sections that render with zero items. If a collection is empty, the section doesn't render at all.
- **Nothing to maintain that nobody will maintain.** Events come from a feed. Everything else is a short markdown file Mike edits a few times a year.
- **The event platform is an implementation detail.** Meetup today, Luma later. Swapping should mean changing one URL in config, not touching pages.
- **Plainspoken and local.** No developer in-jokes, AI jargon, or tech-startup gloss.

## Scope (v1)

In:
- `/` Home
- One page per active meetup series: `/open-hack` now, `/build-with-ai` when confirmed
- `/jobs`: featured local roles. Hidden from the nav and home when empty.
- `/codes`: the nonprofit's single home. Mission, board, 501(c)(3) details, ways to support, and current hosts and partners.
- `/code-of-conduct`, `/privacy`
- Redirects: `/slack` → current invite URL; `/email` → `/#email`; `/support`, `/sponsor`, `/about` → `/codes`

Out (delete from the stalled relaunch PR; do not port):
- Companies directory (`/companies`, `src/content/companies`)
- Where-to-work / venues directory (`/work`, `src/content/venues`). A small `venues` collection for the places *we meet* is still needed (see `04`).
- `/start`: its useful parts (welcome copy, Slack, first-meetup advice, Mike's card) move to home and the series pages
- Stats strip, snowball counter, tmux statusbar, box-drawing pane titles, hero prompt line
- Who's Building / Who's Hiring homepage sections in their current form

## How to start

Work from the existing repo (`codesyracuse/syracuse.io`). Start a fresh branch from `main`. The stalled branch is `site-redesign-2026`: salvage only what's useful (Astro config, Cloudflare Workers deploy setup, Tailwind config and the color tokens in `src/styles/global.css`, any Meetup event fetching). Don't migrate its components wholesale.

## Placeholders

Anything marked `TBD(mike)` is a fact only Mike can supply. Render placeholders visibly in dev, and fail the production build if any `TBD(mike)` string remains in rendered output. In the reference HTML, `[BRACKETED]` text and the sample event dates are placeholders, not real data.

## Success criteria

- Someone landing from a Google search for "Syracuse developer meetup" sees the next date and an RSVP button above the fold on a phone.
- Every page has one clear next action.
- The site meets Google Ad Grants' website expectations: HTTPS, clear mission, several pages of real content, and conversion tracking on RSVP and signup clicks.
- Mike can add a sponsor, a job, or a new series by adding one markdown file.
