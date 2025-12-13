# E2E Testing with Playwright

This project uses Playwright for end-to-end testing of the Syracuse.io website.

## Setup

First, install Playwright browsers:

```bash
npx playwright install chromium
```

## Running Tests

Run all tests (dev server starts automatically):

```bash
npm test
```

Run tests with UI mode (interactive):

```bash
npm run test:ui
```

## Test Coverage

### Homepage (`homepage.spec.ts`)

- Page loads successfully
- Main heading and subtitle display
- Navigation links work
- Welcome message is visible
- Slack invite link is present

### Groups (`groups.spec.ts`)

- Groups listing page loads
- Group cards display correctly (5 groups)
- Individual group pages load (dev-drinks, syr-js)
- Breadcrumbs navigation works
- Call to action for new meetups

### Static Pages (`static-pages.spec.ts`)

- Community page
- Resources page
- Code of Conduct page
- Slack page

### Navigation & Layout (`navigation.spec.ts`)

- Navigation component renders
- Footer displays on all pages
- Navigation links work
- Mobile responsive (375px width)
- Tablet responsive (768px width)

## Writing New Tests

Tests are located in `tests/e2e/`. Follow the existing patterns:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    await page.goto("/path");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
```

## CI Integration

The Playwright config is set up to:

- Run tests in parallel locally
- Run sequentially in CI
- Retry failed tests 2 times in CI
- Generate HTML reports
- Start dev server automatically before tests
