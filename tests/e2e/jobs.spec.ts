import { test, expect } from "@playwright/test";

test.describe("Jobs board", () => {
  test("should load with the header and stats line", async ({ page }) => {
    await page.goto("/jobs");

    await expect(page.locator("h1")).toContainText("Who's hiring");
    await expect(page.getByText(/open role/)).toBeVisible();
  });

  test("post-a-job opens the email modal", async ({ page }) => {
    await page.goto("/jobs");

    await page.locator("#post-job-trigger").click();
    const modal = page.locator("#post-job-modal");
    await expect(modal).toBeVisible();
    await expect(modal.getByText("mike@syracuse.io")).toBeVisible();
  });

  test("job cards expand details and carry copy links", async ({ page }) => {
    await page.goto("/jobs");

    const cards = page.locator("article.job-card");
    test.skip((await cards.count()) === 0, "no live listings to test");

    const first = cards.first();
    await first.locator("summary").click();
    await expect(first.getByText(/view full posting/)).toBeVisible();
    await expect(first.locator(".copy-link")).toHaveAttribute(
      "href",
      /\/jobs#/
    );
  });

  test("old detail URLs redirect to the board anchor", async ({ page }) => {
    await page.goto("/jobs/123-some-old-job");
    await expect(page).toHaveURL(/\/jobs#123-some-old-job/);
  });
});
