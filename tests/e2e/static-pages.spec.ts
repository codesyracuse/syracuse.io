import { test, expect } from "@playwright/test";

test.describe("Static Pages", () => {
  test("should load community page", async ({ page }) => {
    await page.goto("/community");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should load resources page", async ({ page }) => {
    await page.goto("/resources");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should load code of conduct page", async ({ page }) => {
    await page.goto("/code-of-conduct");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should load slack page", async ({ page }) => {
    await page.goto("/slack");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });
});
