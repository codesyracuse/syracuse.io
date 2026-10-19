import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:4321",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "unit",
      testMatch: "unit/**/*.spec.ts",
    },
    {
      name: "chromium",
      testMatch: "e2e/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    // Test the built site; `npm run dev` isn't reliable with the Cloudflare adapter.
    command: "npm run build && npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    // Dummy IDs switch the tracker on so its events can be tested; tests block
    // the request to Google.
    env: {
      PUBLIC_GA_MEASUREMENT_ID: "G-TEST000000",
      PUBLIC_ADS_ID: "AW-000000000",
      PUBLIC_ADS_CONVERSIONS: JSON.stringify({
        rsvp_click: "AW-000000000/rsvp",
        slack_click: "AW-000000000/slack",
        email_signup: "AW-000000000/email",
        sponsor_contact: "AW-000000000/sponsor",
      }),
    },
    timeout: 120000,
  },
});
