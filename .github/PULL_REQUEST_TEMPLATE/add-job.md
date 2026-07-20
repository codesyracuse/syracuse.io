Adds a job listing. Create `src/content/jobs/<company>-<role>.md` with:

```markdown
---
title: Senior Backend Engineer
company: Acme Corp # display name; match a src/content/companies entry if one exists
url: https://acme.example/careers/backend # the company's own posting — required
# applyEmail: hiring@acme.example       # only if applications go by email
location: Syracuse, NY
arrangement: hybrid # on-site | hybrid | remote
term: full-time # full-time | part-time | contract | internship
category: engineering
# salary: "$120K–$150K"                 # optional, freeform
posted: 2026-07-17
expires: 2026-08-17 # listing drops off automatically after this date
featured: false # featured slots are for sponsors — ask first
---

Two or three sentences on the role: what you'd build, the stack, the level
you're hiring for. Written for a human, not an ATS.
```

- [ ] `expires` is a real date — stale listings make the whole board look dead
- [ ] `url` points to the company's own posting, not an aggregator
