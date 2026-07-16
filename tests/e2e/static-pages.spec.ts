import { test, expect } from "@playwright/test";

test.describe("Static Pages", () => {
  test("should load code of conduct page", async ({ page }) => {
    await page.goto("/code-of-conduct");

    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });
});

test.describe("Legacy redirects", () => {
  for (const path of ["/community", "/slack", "/resources"]) {
    test(`should redirect ${path} to /start`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/start/);
    });
  }
});
