import { test, expect } from "@playwright/test";

test.describe("Static Pages", () => {
  test("should load community page", async ({ page }) => {
    await page.goto("/community");

    await expect(page).toHaveTitle(/Community/);
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should load resources page", async ({ page }) => {
    await page.goto("/resources");

    await expect(page).toHaveTitle(/Resources/);
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should load code of conduct page", async ({ page }) => {
    await page.goto("/code-of-conduct");

    await expect(page).toHaveTitle(/Code of Conduct/);
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should load slack page", async ({ page }) => {
    await page.goto("/slack");

    await expect(page).toHaveTitle(/Slack/);
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });
});
