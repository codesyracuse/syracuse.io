# syracuse.io

The front door to the Syracuse, NY tech scene: meetups, companies, jobs, and
places to work, plus the community Slack and newsletter. Maintained in the
open by [CODES](https://syracuse.io/codes), a 501(c)(3) nonprofit.

Want to add your company, a job, or a place to work? See
[CONTRIBUTING.md](CONTRIBUTING.md) — it takes about five minutes.

## Development

```sh
npm install
npm run build && npm run preview   # http://localhost:4321
```

| Command                | Purpose                                         |
| :--------------------- | :---------------------------------------------- |
| `npm run dev`          | Dev server at `localhost:4321`                  |
| `npm run build`        | Production build to `./dist/`                   |
| `npm run preview`      | Serve the production build locally              |
| `npm run lint`         | ESLint and Prettier check                       |
| `npm test`             | Playwright end-to-end tests                     |
| `npm run fetch-events` | Scrape Meetup and update `src/data/events.json` |

Content lives in `src/content/{companies,venues,jobs}` as Markdown files;
events live in `src/data/events.json` and sync daily from Meetup.
