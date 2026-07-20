import { test, expect } from "@playwright/test";

test.describe("Start page", () => {
  test("should load with onboarding sections", async ({ page }) => {
    await page.goto("/start");

    await expect(page.locator("h1")).toContainText("Find your people");
    await expect(page.getByText("WHAT THIS IS")).toBeVisible();
    await expect(page.getByText("JOIN THE SLACK")).toBeVisible();
    await expect(page.getByText("YOUR FIRST MEETUP")).toBeVisible();
    await expect(page.getByText("A human runs this")).toBeVisible();
  });

  test("should link to the Slack invite", async ({ page }) => {
    await page.goto("/start");

    const slackLink = page.locator('a[href*="slack.com"]').first();
    await expect(slackLink).toBeVisible();
  });

  test("should include the emoji intro tradition", async ({ page }) => {
    await page.goto("/start");

    await expect(page.getByText(/minimum of five emojis/)).toBeVisible();
    await expect(page.getByText("#intros")).toBeVisible();
  });

  test("should link to the code of conduct", async ({ page }) => {
    await page.goto("/start");

    await expect(page.locator('a[href="/code-of-conduct"]')).toBeVisible();
  });

  test("should point to work, companies, and jobs", async ({ page }) => {
    await page.goto("/start");

    for (const href of ["/work", "/companies", "/jobs"]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
  });
});
