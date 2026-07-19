---
name: add-company
description: Import a company from its website URL into src/content/companies as a directory card. Use when given a company link to add to the syracuse.io companies page.
---

# Add a company from a URL

The argument is a company's website URL. Turn it into a file in
`src/content/companies/` that passes the schema in `src/content.config.ts`.

## Steps

1. **Dedupe first**: check `src/content/companies/` for an existing file for
   this company. If one exists, update it instead of creating a duplicate.
2. **Fetch the site** with WebFetch (homepage, plus /about and /careers if
   they exist). Extract: official name, what they do, where their Syracuse /
   CNY presence is, rough headcount, founding year, and whether they have
   open roles.
3. **Write the file** as `src/content/companies/<slug>.md`:

   ```markdown
   ---
   name: Acme Corp
   tagline: widgets # 1–3 lowercase words, category not slogan
   url: https://acme.example
   tags: [product, hardware]
   size: "51-200" # 1-10 | 11-50 | 51-200 | 200+
   founded: 2012 # omit if not stated anywhere
   location: Armory Square # neighborhood or town of the CNY presence
   blurb: "One plain sentence on what they build and their Syracuse tie."
   # careersUrl: https://acme.example/careers   # only if the page exists
   # hiring: true                               # only if roles are open now
   added: 2026-07-19 # today
   ---
   ```

   - **tags**: reuse the existing vocabulary — check
     `grep -h "^tags:" src/content/companies/*.md` before inventing a new tag.
   - **size**: bucket for the local/company presence; if you can't tell,
     pick the conservative smaller bucket.
   - **blurb**: one sentence, written like the seeds (plain, concrete, notes
     the Syracuse connection). No marketing superlatives.
   - **logo**: optional. If a clean logo file is provided, save it under
     `src/content/companies/logos/` and set `logo: ./logos/<slug>.png` —
     otherwise omit; the card renders a monogram tile automatically.
   - `sponsor:` is never set by this skill — that's a maintainer decision.

4. **Validate** with `npm run build`, then
   `CI=true npx playwright test tests/e2e/companies.spec.ts`.
5. **Offer a PR**: branch `company/<slug>`, commit, open a PR titled
   "Add <name> to the companies directory". Ask before pushing.

## Honesty rules

- Only list companies with a real Central New York presence (office, plant,
  or founded here). If you can't find one, say so instead of adding it.
- `founded`, `size`, and `location` are visible claims on the card — omit
  anything you can't source from the company's own site rather than guessing.
