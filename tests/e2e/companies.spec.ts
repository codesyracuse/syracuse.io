import { test, expect } from "@playwright/test";

test.describe("Companies directory", () => {
  test("should list the seeded companies as cards", async ({ page }) => {
    await page.goto("/companies");

    await expect(page.locator("h1")).toContainText("Who's building");
    const cards = page.locator("div.card");
    expect(await cards.count()).toBeGreaterThanOrEqual(15);
    // Every card carries a monogram tile (or logo) and a meta line.
    await expect(
      page.locator("div.card").first().locator("span.font-mono").first()
    ).toBeVisible();
  });

  test("should filter by tag via query params (no JS required)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/companies");
    const allCount = await page
      .locator("h2")
      .filter({ hasText: /COMPANIES/ })
      .textContent();

    await page.locator('a[href="/companies?tag=defense"]').click();
    await expect(page).toHaveURL(/tag=defense/);
    const filteredCount = await page
      .locator("h2")
      .filter({ hasText: /COMPAN/ })
      .textContent();

    expect(filteredCount).not.toEqual(allCount);
    await context.close();
  });

  test("should offer the add-your-company chip", async ({ page }) => {
    await page.goto("/companies");

    const addChip = page.getByRole("link", { name: /add your company/i });
    await expect(addChip).toBeVisible();
    await expect(addChip).toHaveAttribute("href", /github\.com/);
  });

  test("should show companies on the homepage", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("WHO'S BUILDING")).toBeVisible();
    await expect(page.getByText(/companies listed/i)).toBeVisible();
  });

  test("statusbar should count companies", async ({ page }) => {
    await page.goto("/companies");

    await expect(page.locator(".statusbar")).toContainText("companies");
  });
});
