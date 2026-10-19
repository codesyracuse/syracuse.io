# syracuse.io

The front door to Syracuse's tech community: monthly meetups, a local Slack, and a monthly email. Run by CODES, a 501(c)(3) nonprofit.

Static [Astro](https://astro.build) site on Cloudflare Workers. The design and content specs are in [`docs/rebuild/`](docs/rebuild/00-START-HERE.md).

## Develop

Requires Node 22+ (see `.nvmrc`).

```sh
npm install
npm run build && npm run preview   # http://localhost:4321
```

| Command           | Purpose                                      |
| :---------------- | :------------------------------------------- |
| `npm run build`   | Build to `dist/`                             |
| `npm run preview` | Serve the build locally                      |
| `npm run lint`    | ESLint and Prettier check                    |
| `npm run format`  | Format with Prettier                         |
| `npm test`        | Build, preview, and run the Playwright tests |

Install the test browser once with `npx playwright install chromium`.

## Updating content

Everything except events is a short markdown file in `src/content/`:

- `series/`: one file per meetup series (gets its own page)
- `sponsors/`: hosts, event sponsors and annual partners
- `jobs/`: local roles (expire automatically)
- `photos/`: event photos for the home page
- `venues/`, `events/`: places we meet, and manual events

Events themselves come from the iCal feeds in `src/config/events.ts` and refresh on every build. The site rebuilds and deploys daily.

Anything still marked `TBD(mike)` shows as a visible placeholder, and the production deploy fails until every one is filled in.

## Contributing

Open a pull request. CI lints, builds and tests every PR.
