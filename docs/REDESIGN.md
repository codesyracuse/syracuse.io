# syracuse.io Redesign Spec

Handoff document for rebuilding syracuse.io. The reference mockup is
`syracuse_io_v3_final.html` — treat its CSS custom properties and component
patterns as the source of truth for visual decisions. This doc covers intent,
information architecture, data modeling, and build order.

## 1. Purpose & audience

syracuse.io is the community hub for the Syracuse, NY tech scene, maintained
in the open by CODES (a 501(c)(3) nonprofit). The site optimizes for the
**newcomer at the margin**: the person who just moved here (Micron era), the
SU/OCC grad deciding whether to stay, the career-switcher, and the remote
worker looking for other humans. Existing community members will show up
regardless; the site earns its keep by converting strangers.

Secondary audience: sponsors. The site is the durable inventory that
sponsorship buys (logo placement, enhanced company profiles). Every page
carries a quiet footer line: _"maintained in the open by CODES, a 501(c)(3)
nonprofit. Sponsorship buys the pizza — nothing more, nothing less."_

Design thesis: **information-first civic infrastructure with terminal DNA.**
No hero images, no gradients, no marketing cards. The homepage proves the
scene is alive by showing live data. Terminal flavor (monospace data, pane
titles, statusbar) signals "built by devs" without excluding non-devs.

## 2. Design system

### Tokens (CSS custom properties)

| Token     | Value     | Use                                                                                             |
| --------- | --------- | ----------------------------------------------------------------------------------------------- |
| `--salt`  | `#F1F2EE` | page background (cool salt-white, never warm cream)                                             |
| `--ink`   | `#1B211F` | text, header/footer/statusbar background, borders                                               |
| `--brick` | `#A03C2A` | primary CTA, links-that-act, accents                                                            |
| `--steel` | `#33566B` | stats bar background, secondary data color                                                      |
| `--plow`  | `#EDB230` | scarce accent: the `.io` in wordmark, snowball counter, statusbar top border. Use nowhere else. |
| `--card`  | `#FBFBF9` | card/chip backgrounds                                                                           |
| `--line`  | `#D4D6D0` | hairline row separators                                                                         |

### Typography

- **Data is monospace** (`ui-monospace` stack): dates, venues, stats, tags,
  nav, section titles, footer fine print. If it could appear in a terminal,
  it's mono.
- **Prose is system sans**, weight 650–800 for emphasis. Headlines: heavy
  weight, tight leading, sentence case in hero, UPPERCASE in section signs.
- No webfonts. The personality comes from weight, case, and spacing.

### Signature components (see mockup for exact CSS)

1. **Row with dotted leader** — the core list unit for events, jobs, venues:
   `[mono key] [bold name] [dotted leader fills space] [mono meta]`.
   Whole row is the link target; hover fills `#E9EBE5`.
2. **Pane title** — section headers styled `┤ SECTION NAME ├` with the
   box-drawing characters in `--brick`, over a 3px ink bottom border.
3. **Stats strip** — full-width `--steel` band under the hero; 4 build-time
   counts in mono (events this month, Slack members, companies, open roles).
4. **Fixed statusbar** — tmux-style bar pinned to viewport bottom: ink
   background, 3px `--plow` top border, mono segments in brackets:
   `[712 on slack] [43 companies] [❄ 127.4″ SYR leads the snowball] [? start here]`.
5. **Chips** — company directory items: 2px ink border, mono, invert on
   hover. The "+ add your company" chip uses dashed border + brick text.
6. **Startcard** — bordered brick card with avatar circle: "A human runs
   this" block (see §4, Home).

### Rules

- Never use "timetable" in copy. No typewriter/Smith-Corona references.
- `--plow` yellow appears at most 3 places per page.
- Respect `prefers-reduced-motion`; transitions are background/color only.
- Mobile: nav collapses to "start here" + menu; row meta (`.where`) hides;
  stats grid goes 2-up; statusbar drops middle segments.
- Every page must render meaningfully with JS disabled (Astro static output).

## 3. Information architecture

```
/            home: live dashboard of the scene
/start       the onboarding page (primary CTA sitewide)
/events      full calendar
/groups      existing content collection (keep)
/companies   directory (new collection)
/jobs        board (new collection)
/work        "Where to Work" venues (new collection)
/codes       the nonprofit: about, sponsor, donate
```

## 4. Page specs

### Home

Section order (each backed by content collections, computed at build):

1. **Hero** (ink background): eyebrow "Salt City · Central New York";
   H1 "Syracuse builds software. _Come build with us._" (em in plow);
   subhead; CTAs: `Start here →` (brick, primary) + `join the Slack` (ghost).
2. **Stats strip** — counts derived from collections at build time.
3. **┤ NEXT UP ├** — next 3 events, link to /events.
4. **┤ WHO'S HIRING ├** — 3 most recent jobs, link to /jobs.
5. **┤ WHO'S BUILDING ├** — 5 newest company chips + "+ add your company",
   link to /companies.
6. **┤ WHERE TO WORK ├** — compact: exactly 3 rows (one cowork, one café,
   one free venue), link "all spots + day rates →" to /work. Keep this
   section small on home; the full treatment lives on /work.
7. **Startcard "A human runs this"** — Mike's intro, direct email
   `mike@syracuse.io` (mailto). Copy in mockup; keep the "too small for a
   public Slack channel" line — it's the point.
8. **Footer**: newsletter signup ("One email a month · events, jobs, and
   who's new"), links (github repo, edit this page, sponsor a meetup),
   501(c)(3) fine print.
9. **Fixed statusbar** (site-wide component).

### /start

The most important page. Tone: zero jargon, warm, short. Sections:

1. **Welcome** — what this community is (free, volunteer-run, all skill
   levels) and isn't (recruiting funnel, gatekept).
2. **Join the Slack** — join link + the #intros tradition: first message
   with who you are, where you're from, what you're doing, minimum 5 emojis.
   (Resurrect the emoji-hello rule verbatim from the old OCC handout.)
3. **Your first meetup** — what to expect, nobody checks credentials, which
   event is most beginner-friendly, no laptop required unless noted.
4. **Who runs this** — Mike's intro (2–3 sentences, photo optional),
   direct email, link to /codes.
5. **Pointers** — /work, /companies, /jobs cards.

### /events

- List view grouped by month using the row component; past events collapse.
- "Submit an event" links to a GitHub issue form or PR template.

### /companies

- Filterable grid of chips/cards: filter by tag (product, consultancy,
  agency…) and size. Sponsor companies get enhanced cards (logo, blurb,
  photo, jobs cross-linked) and sort first within filters — labeled
  "sponsor" honestly.
- "+ add your company" → PR template (see §6).

### /jobs

- Row list, newest first, each linking to the company's own posting.
  Front-matter `expires` date; expired jobs drop at build time (stale jobs
  are the fastest way to make a site look dead).
- Featured (sponsor) listings get a brick tag, sort first, labeled.

### /work

- Full venue cards grouped by type: `cowork`, `cafe`, `free`.
- Card fields: name, neighborhood, one-line vibe, hours, amenities
  (meeting rooms, outlets, parking), and a **link to the venue's own
  pricing page — never hardcode dollar amounts** (prices rot; links don't).
- Café etiquette line: "buy a drink an hour."
- Seed venues: Commonspace Work, Syracuse CoWorks, GereBlock Lounge,
  ShareCuse (cowork); Salt City Coffee, Recess Westcott, Cafe Blue,
  Kairos (café); Central Library — free bookable rooms (free).
  Verify details before shipping; treat this list as leads, not facts.

### /codes

- What the nonprofit is (one paragraph, honest scale), the board, how to
  sponsor (link the prospectus tiers: $250/event, $1,500/year, host
  in-kind), donate button, EIN + 501(c)(3) statement, bylaws/annual
  report links when they exist.

## 5. Content collections (Astro)

Extend the existing `src/content/` pattern. Schemas (zod, abbreviated):

```ts
// companies
{ name: string, tagline: string, url: string, tags: string[],
  size: enum('1-10','11-50','51-200','200+'), added: date,
  sponsor: boolean = false, logo?: image, blurb?: string }

// jobs
{ title: string, company: reference('companies') | string, url: string,
  location: enum('on-site','hybrid','remote'), posted: date,
  expires: date, featured: boolean = false }

// venues
{ name: string, type: enum('cowork','cafe','free'),
  neighborhood: string, address: string, url: string,
  pricingUrl?: string, hours: string, vibe: string,
  meetingRooms: boolean, notes?: string, added: date }

// events — keep existing shape; add `venue?: string`.
```

Build-time derived data (`src/lib/stats.ts`): eventsThisMonth,
companyCount, openJobCount (non-expired), slackMemberCount (hardcoded
constant updated occasionally, or fetched at build if an API exists),
snowfall (see below).

**Snowball counter**: build-time fetch of season snowfall (NWS API) with a
hardcoded fallback value so builds never break; render in statusbar. It
only changes in winter. Cache in a JSON committed by a scheduled action if
you want it fresh without build-time network risk.

## 6. Contribution flow

The site is itself a community project — optimize the first-PR experience:

- **PR templates**: `add-company.md`, `add-venue.md`, `add-job.md` — each a
  copy-paste front-matter block with comments.
- **Issue forms** for non-git folks; a maintainer converts to PRs.
- `CONTRIBUTING.md` rewritten around "add your company in 5 minutes."
- Every page footer: "edit this page" deep link to the file on GitHub.
- Venue additions are the lowest-stakes first contribution; expect the
  contributor funnel to start there.

## 7. Build order

1. Design tokens + base layout (header, footer, statusbar) as shared
   components; port home page per §4.
2. `companies` collection + /companies + home section. **Seed 15–20 real
   entries before any announcement** — an empty directory kills the pitch.
3. `venues` collection + /work + compact home section.
4. /start (pure content; can ship day one).
5. `jobs` collection + /jobs with expiry logic.
6. Newsletter signup wiring (Buttondown or similar), /codes page,
   snowfall fetch.

## 8. Out of scope (deliberately)

- No blog/news/editorial section — infrastructure, not media.
- No user accounts, comments, or CMS — git is the CMS.
- No `.ics` calendar feed — Meetup already offers one.
- No analytics beyond privacy-friendly page counts (e.g. Cloudflare's).
- No scraped job aggregation — self-serve listings only.
