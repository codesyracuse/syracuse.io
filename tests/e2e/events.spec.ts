import { test, expect } from "@playwright/test";

test.describe("Events calendar", () => {
  test("should load with past events grouped by month", async ({ page }) => {
    await page.goto("/events");

    await expect(page.locator("h1")).toContainText("Events");
    await expect(
      page.getByRole("heading", { name: /PAST EVENTS/ })
    ).toBeVisible();
    // Month groups only — the masthead's mobile menu is a <details> too,
    // so filter to summaries that carry a year.
    expect(
      await page
        .locator("details")
        .filter({ hasText: /20\d\d/ })
        .count()
    ).toBeGreaterThan(0);
  });

  test("past months expand to show event rows with hosts", async ({ page }) => {
    await page.goto("/events");

    const firstMonth = page
      .locator("details")
      .filter({ hasText: /20\d\d/ })
      .first();
    await firstMonth.locator("summary").click();
    const row = firstMonth.locator("a").first();
    await expect(row).toBeVisible();
    await expect(row).toHaveAttribute("href", /meetup\.com/);
  });

  test("should offer a submit-an-event link", async ({ page }) => {
    await page.goto("/events");

    const submit = page.getByRole("link", { name: /submit an event/i });
    await expect(submit).toBeVisible();
    await expect(submit).toHaveAttribute("href", /github\.com/);
  });

  test("legacy group URLs redirect to /events", async ({ page }) => {
    await page.goto("/groups");
    await expect(page).toHaveURL(/\/events/);

    await page.goto("/groups/open-hack");
    await expect(page).toHaveURL(/\/events/);
  });
});
