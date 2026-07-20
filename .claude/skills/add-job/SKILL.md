---
name: add-job
description: Import a job posting from a URL into src/content/jobs as a markdown listing. Use when given a job posting link to add to the syracuse.io job board.
---

# Add a job listing from a URL

The argument is a URL to a job posting. Turn it into a file in
`src/content/jobs/` that passes the schema in `src/content.config.ts`.

## Steps

1. **Fetch the posting** with WebFetch. Extract: title, company name,
   location, on-site/hybrid/remote, full-time/part-time/contract/internship,
   salary (only if explicitly stated), and what the role actually involves.
2. **Prefer the company's own posting.** If the URL is an aggregator
   (LinkedIn, Indeed, etc.), look for the direct careers-page link inside it
   and use that as `url`. Only fall back to the aggregator if there is no
   direct posting.
3. **Write the file** as `src/content/jobs/<company>-<role>.md` (kebab-case;
   the filename becomes the stable `#anchor` on /jobs, so keep it short and
   don't rename it later). Follow the frontmatter documented in
   `.github/PULL_REQUEST_TEMPLATE/add-job.md`:
   - `posted:` today's date
   - `expires:` the posting's own close date if stated, otherwise posted + 30 days
   - `salary:` only if the posting states one — never estimate
   - `featured:` stays `false` (featured slots are for sponsors)
   - `category:` defaults to `engineering`; use another word only if it's
     clearly not an engineering role (design, product, data, it...)
4. **Write the body**: 2–3 short paragraphs in a human voice summarizing what
   you'd build, the stack, and the level. Summarize — do not paste the posting
   verbatim, and drop ATS boilerplate (EEO statements, "fast-paced
   environment", benefits lists).
5. **Cross-link check**: if the company has an entry in
   `src/content/companies/`, make `company:` match its `name:` exactly — that
   auto-lights the "hiring" badge on /companies. If it doesn't have one,
   mention that `/add-company` could add it.
6. **Validate** with `npm run build` (zod runs at build time), then run the
   jobs spec: `CI=true npx playwright test tests/e2e/jobs.spec.ts`.
7. **Offer a PR**: branch `job/<slug>`, commit the one file, and open a PR —
   the body checklist lives in `.github/PULL_REQUEST_TEMPLATE/add-job.md`.
   Ask before pushing.

## Honesty rules

- Never invent salary, close dates, or seniority the posting doesn't state.
- If the posting is expired or clearly outside Central New York with no
  remote option, say so instead of adding it.
