import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should display navigation on homepage", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("should have the masthead links", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("header nav");
    for (const label of [
      "start here",
      "events",
      "where to work",
      "companies",
      "jobs",
    ]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("should navigate to events page from navigation", async ({ page }) => {
    await page.goto("/");

    await page
      .locator("header nav")
      .getByRole("link", { name: "events" })
      .click();
    await expect(page).toHaveURL(/\/events/);
  });
});

test.describe("Footer", () => {
  test("should display footer on all pages", async ({ page }) => {
    const pages = ["/", "/events", "/start"];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const footer = page.locator("footer").first();
      await expect(footer).toBeVisible();
    }
  });
});

test.describe("Statusbar", () => {
  test("should pin the statusbar without covering content", async ({
    page,
  }) => {
    await page.goto("/");

    const statusbar = page.locator(".statusbar");
    await expect(statusbar).toBeVisible();
    await expect(statusbar).toContainText("on slack");

    const position = await statusbar.evaluate(
      (el) => getComputedStyle(el).position
    );
    expect(position).toBe("fixed");

    const bodyPadding = await page.evaluate(() =>
      parseInt(getComputedStyle(document.body).paddingBottom, 10)
    );
    expect(bodyPadding).toBeGreaterThanOrEqual(40);
  });
});

test.describe("Responsive Design", () => {
  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.locator("body")).toBeVisible();

    const mainContent = page.locator("main, article, .container").first();
    await expect(mainContent).toBeVisible();

    // Masthead wraps instead of hiding links behind a menu
    const nav = page.locator("header nav");
    await expect(nav.getByRole("link", { name: "events" })).toBeVisible();
  });

  test("should be tablet responsive", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/events");

    await expect(
      page.getByRole("heading", { name: /PAST EVENTS/ })
    ).toBeVisible();
  });
});
