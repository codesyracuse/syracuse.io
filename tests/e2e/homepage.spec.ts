import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Syracuse.io/i);
  });

  test("should display the hero", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Syracuse builds software/i })
    ).toBeVisible();
    await expect(page.getByText(/Salt City · Central New York/i)).toBeVisible();
  });

  test("should have primary CTAs", async ({ page }) => {
    await page.goto("/");

    const startCta = page.getByRole("link", { name: /Start here/i }).first();
    await expect(startCta).toBeVisible();
    await expect(startCta).toHaveAttribute("href", "/start");

    const slackCta = page.getByRole("link", { name: /join the Slack/i });
    await expect(slackCta).toBeVisible();
    await expect(slackCta).toHaveAttribute("href", /slack\.com/);
  });

  test("should show the stats strip", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/events this month/i)).toBeVisible();
    await expect(page.getByText(/members on Slack/i)).toBeVisible();
    await expect(page.getByText(/open roles/i)).toBeVisible();
  });

  test("should show live data sections", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("NEXT UP")).toBeVisible();
    await expect(page.getByText("WHO'S HIRING")).toBeVisible();
  });

  test("should show the startcard", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/A human runs this/i)).toBeVisible();
    await expect(page.getByText("mike@syracuse.io").first()).toBeVisible();
  });
});
