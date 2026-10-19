# Handoff: syracuse.io rebuild

## Put these files in the repo

Copy this whole folder into the syracuse.io repo as `docs/rebuild/`:

```
docs/rebuild/
  00-START-HERE.md
  01-brief.md
  02-pages.md
  03-design.md
  04-data-and-integrations.md
  reference/index.html
  reference/open-hack.html
```

Commit it to `main` (or to the new branch) so every Claude Code session can read it.

## Kickoff prompt for Claude Code

> Read everything in `docs/rebuild/`, starting with `01-brief.md`, and open the two pages in `docs/rebuild/reference/` to see the target design. Then make a plan for rebuilding the site on a new branch off `main`, salvaging the Astro and Cloudflare setup and the color tokens from `site-redesign-2026`. Show me the plan before writing code. Build in this order: layout and design tokens, then the events feed with dedupe, then home, then `/open-hack`, then `/codes`, then `/jobs`, then redirects and analytics. Leave every `TBD(mike)` as a visible placeholder.

## Facts Mike still needs to supply (`TBD(mike)`)

- Canonical general contact email
- Open Hack first-time details: how to find the room, typical attendance, food
- Commonspace street address and parking note
- Prices: featured job, event sponsor, annual partner
- Real per-event cost (for "your money pays for…")
- Board names and roles; CODES founding year; EIN and tax-deductibility wording
- Email list provider
- Approval of the `/codes` mission wording
