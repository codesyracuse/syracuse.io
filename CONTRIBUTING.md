# Contributing to syracuse.io

This site is maintained in the open by the people in it. Git is the CMS:
every company, job, and place to work is a small Markdown file, and adding
one is a great first pull request.

## Add your company in 5 minutes

1. Go to [`src/content/companies`](https://github.com/codesyracuse/syracuse.io/tree/main/src/content/companies)
   and click **Add file → Create new file**. GitHub will fork the repo for you.
2. Name it `your-company.md` and paste the front matter from
   [the add-company template](.github/PULL_REQUEST_TEMPLATE/add-company.md).
3. Fill it in, then **Propose new file** and open the pull request.

That's it. A maintainer will review and merge it, and your company shows up
on [/companies](https://syracuse.io/companies) on the next deploy.

Adding a [place to work](.github/PULL_REQUEST_TEMPLATE/add-venue.md) or a
[job](.github/PULL_REQUEST_TEMPLATE/add-job.md) works the same way, in
`src/content/venues` and `src/content/jobs`.

**Not a git person?** Email [mike@syracuse.io](mailto:mike@syracuse.io) or
[open an issue](https://github.com/codesyracuse/syracuse.io/issues/new) with
the details, and we'll add it for you.

## Events

Events come from the [Syracuse Software Development Meetup](https://www.meetup.com/syracuse-software-development-meetup/)
and sync automatically every day — don't edit `src/data/events.json` by hand.
To get an event listed, [open an issue](https://github.com/codesyracuse/syracuse.io/issues/new?title=Submit%20an%20event).

## Working on the site itself

```sh
npm install
npm run build && npm run preview   # http://localhost:4321
npm run lint                       # ESLint + Prettier
npm test                           # Playwright end-to-end tests
```

The site is [Astro](https://docs.astro.build) with Tailwind, deployed to
Cloudflare Workers. Every pull request gets its own preview deploy, linked in
a comment on the PR.

Please be kind — everything here falls under our
[code of conduct](https://syracuse.io/code-of-conduct).
