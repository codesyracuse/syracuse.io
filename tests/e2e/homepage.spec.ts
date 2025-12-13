import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Syracuse.io/);
  });

  test("should display main heading and subtitle", async ({ page }) => {
    await page.goto("/");

    // Check for main heading
    const heading = page.getByRole("heading", { name: /syracuse\.io/i });
    await expect(heading).toBeVisible();

    // Check for subtitle
    await expect(
      page.getByText(/your local developer community/i)
    ).toBeVisible();
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/");

    // Check for key navigation links
    await expect(
      page.getByRole("link", { name: /local meet ups/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /local data resources/i })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /community/i })).toBeVisible();
  });

  test("should display welcome message", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/Welcome to/i)).toBeVisible();
    await expect(
      page.getByText(/This is your one stop for information/i)
    ).toBeVisible();
  });

  test("should have Slack invite link", async ({ page }) => {
    await page.goto("/");

    const slackLink = page.getByRole("link", { name: /local slack group/i });
    await expect(slackLink).toBeVisible();
    await expect(slackLink).toHaveAttribute("href", /slack\.com/);
  });
});
