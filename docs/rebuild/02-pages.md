# Pages and content

The copy below is the approved draft, matching `reference/index.html` and `reference/open-hack.html`. Keep the tone plain, warm, local, and confident. No exclamation points, no "awesome," no jargon in headlines.

**Global nav**, left to right: `syracuse.io` wordmark · meetups · jobs (only when there are active jobs) · codes · **RSVP** button (links to the next event's RSVP).

**Global footer:**
- rsvp · slack · monthly email
- "run by CODES, a 501(c)(3) nonprofit" · code of conduct · privacy
- Contact: `TBD(mike)`, the canonical general address

---

## Home `/`

1. **Next up (hero, dark band).**
   - Eyebrow: `Next up · Open Hack` (the next event's series)
   - Big date: `TUE OCT 13`, with the day name in `--plow`
   - Mono line: time · venue · neighborhood
   - Buttons: **RSVP for Oct 13 →** (primary) and "all upcoming" (scrolls to Upcoming)
   - Below a rule: **"Syracuse's developer community. Every month since April 2014."**
   - If the feed has no upcoming events, show the series cards with their rhythm instead. Never show "no events."

2. **What this is.**
   > A free, volunteer-run community for people who care about software and technology in and around Syracuse: students, career-switchers, hobbyists, and people who've been shipping for decades. We meet in person every month, talk in a local Slack in between, and send one email a month.

3. **Upcoming.** The next 3–4 events after the hero's, as event rows. The source label ("via Meetup") comes from the provider field, never hardcoded. Hide the section if there are fewer than 2 events.

4. **The series.** One card per active series: rhythm eyebrow, name, one-line summary, host, "details →". Cards that link get the steel backshadow.

5. **Three ways in (steel band).**
   - **01 Come to a meetup.** "Show up, say hi, bring a laptop or don't." → RSVP
   - **02 Join the Slack.** "Ask questions, find people, see local jobs." → `/slack`
   - **03 Get the monthly email.** "Upcoming meetups and local jobs. Once a month." → inline form (`id="email"`)

6. **Photos.** The 4 most recent from `src/content/photos`, with mono captions. Hidden if there are none.

7. **"Who can I reach out to?"** Mike's card: photo, then
   > Hi, I'm Mike. I organize these meetups and keep the lights on through **CODES**. If you're new, nervous, or have a question that feels too small for Slack, email me at mike@syracuse.io. I answer.

   "CODES" is a button that opens a small popover:
   > *501(c)(3) nonprofit*
   > CODES is the nonprofit dedicated to growing and sustaining the Syracuse tech community.
   > see more at /codes →

   Use the native HTML `popover` attribute with `popovertarget`, as in the reference, so it needs no JS. It must be keyboard-accessible and close on Escape and outside click (native behavior).

8. **Made possible by.** Hosts and annual partners as single-color logos, plus a "support syracuse.io →" link to `/codes`. Hidden if there are no sponsors.

---

## Series page `/[series]` (template; first instance `/open-hack`)

This is the Google Ads landing page for its series. It needs real content (300+ words), a clear RSVP, and the series' keywords in the title and h1.

1. **Hero (dark band).** Eyebrow `A monthly developer meetup in Syracuse, NY`, h1 series name, a mono rhythm line, then "Next one" with the big date, venue, and RSVP button.
2. **What happens.**
   > Open Hack is an unstructured evening of working on whatever you want next to other people who write code. Bring a side project, homework, your day job, or nothing at all. Plenty of people just come to talk.
   >
   > There are no talks, no agenda, and nobody checks your résumé at the door. If you're stuck on something, say so out loud; someone in the room has probably hit the same wall.
3. **Your first time.** Label/value rows:
   - arrive: Any time after 6. Nobody minds if you're late or leave early.
   - find us: `TBD(mike)`
   - crowd: Usually around `TBD(mike)` people, regulars and first-timers.
   - food: `TBD(mike)`
   - bring: A laptop helps but isn't required.
4. **Sidebar cards.** *Who it's for* (first-timers and the curious, students, career-switchers and bootcamp grads, working developers, anyone new to Syracuse) and *Where* (venue, address `TBD(mike)`, parking note, maps link, "Hosted by {host}. Thank you.").
5. **Coming up.** The next 3 dates for this series, with "meeting monthly since April 2014" beside the heading. Use the series' own `since` if it differs.
6. **Closing band:** "Can't make it this month?" → join the Slack / get the email.

`/build-with-ai` uses the same template. Ship it only when `active: true`.

---

## Jobs `/jobs`

- Intro: "Software and tech roles at Syracuse-area employers. Locals post for free in our Slack's #jobs channel; employers can feature a role here, in the monthly email, and at our next meetup."
- Active jobs: title, company, location/remote, posted date, link out. Featured jobs go first with a subtle "Featured" label.
- **Employers box:** "Hiring in Syracuse? Feature a role." Included: listing on the site, the monthly email, pinned in #jobs, and a mention at the next meetup. Price `TBD(mike)`.
- **Empty state:** intro, a link to #jobs, and the employers box only. Never show "0 jobs." Hide Jobs from the nav and home.

---

## CODES `/codes`

The nonprofit's one page. Order:

1. **Mission:** "CODES is the nonprofit dedicated to growing and sustaining the Syracuse tech community. We run free, recurring meetups and connect people with each other and with local opportunities. We aim to break even, not to grow an organization." (`TBD(mike)`: approve wording.)
2. **What it costs:** what a free monthly meetup costs to run and where money goes. Per-event cost `TBD(mike)`.
3. **Ways to support:** four rows, each with what you give, what you get, and a price or "in-kind":
   - **Host:** free space → "Hosted at" credit on the series page and event listings, thanks at the event, logo on the site
   - **Event sponsor:** covers one night's food → named on that event's listing, thanked from the front of the room, in that month's email
   - **Featured job:** paid posting → site + email + pinned in #jobs + meetup mention
   - **Annual partner:** one yearly payment → logo on every page, every email, every event, plus first call for hosting or speaking
   - Prices `TBD(mike)`
4. **Current hosts and partners** (logos)
5. **Board:** names and roles, `TBD(mike)`
6. **Legal:** Coalition of Digital Engagement in Syracuse, 501(c)(3); donations may be tax-deductible (`TBD(mike)`: confirm wording); EIN `TBD(mike)`
7. **CTA:** email Mike. Later: "Download the sponsor packet (PDF)."
8. **History:** meetups monthly since April 2014; CODES founded `TBD(mike)`

---

## Code of conduct `/code-of-conduct`, Privacy `/privacy`

Port the existing text. Privacy must mention analytics/conversion tracking and the email provider.
