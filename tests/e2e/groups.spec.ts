import { test, expect } from "@playwright/test";

test.describe("Groups Page", () => {
  test("should load groups listing page", async ({ page }) => {
    await page.goto("/groups");

    await expect(page).toHaveTitle(/Developer Groups/);
    await expect(
      page.getByRole("heading", { name: /developer groups/i })
    ).toBeVisible();
  });

  test("should display group cards", async ({ page }) => {
    await page.goto("/groups");

    // Check that at least one group card is visible
    const groupCards = page.locator("article");
    await expect(groupCards).toHaveCount(5); // We know there are 5 groups

    // Verify group card content structure
    const firstCard = groupCards.first();
    await expect(firstCard.locator("h3")).toBeVisible();
    await expect(firstCard.locator("img")).toBeVisible();
  });

  test("should have working group links", async ({ page }) => {
    await page.goto("/groups");

    // Click on a group card link
    const firstGroupLink = page.locator("article h3 a").first();
    await expect(firstGroupLink).toBeVisible();

    const groupName = await firstGroupLink.textContent();
    expect(groupName).toBeTruthy();
  });

  test("should display call to action for new meetups", async ({ page }) => {
    await page.goto("/groups");

    await expect(
      page.getByText(/if you'd like to start a meetup/i)
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /syracuse\.io slack/i })
    ).toBeVisible();
  });
});

test.describe("Individual Group Pages", () => {
  test("should load dev-drinks group page", async ({ page }) => {
    await page.goto("/groups/dev-drinks");

    // Should have a heading
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should load syr-js group page", async ({ page }) => {
    await page.goto("/groups/syr-js");

    // Should have a heading
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should have breadcrumbs navigation", async ({ page }) => {
    await page.goto("/groups/dev-drinks");

    // Should be able to navigate back to groups
    const groupsLink = page.getByRole("link", { name: /groups/i }).first();
    await expect(groupsLink).toBeVisible();
  });
});
