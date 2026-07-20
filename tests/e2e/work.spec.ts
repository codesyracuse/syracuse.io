import { test, expect } from "@playwright/test";

test.describe("Where to work", () => {
  test("should group venues by type", async ({ page }) => {
    await page.goto("/work");

    await expect(page.locator("h1")).toContainText("Where to work");
    for (const section of ["COWORK", "CAFÉS", "FREE"]) {
      await expect(
        page.getByRole("heading", { name: new RegExp(section) })
      ).toBeVisible();
    }
  });

  test("should include the café etiquette line", async ({ page }) => {
    await page.goto("/work");

    await expect(page.getByText(/buy a drink an hour/i)).toBeVisible();
  });

  test("should link to venue pricing pages, never hardcode rates", async ({
    page,
  }) => {
    await page.goto("/work");

    const ratesLink = page.getByRole("link", { name: /rates/ }).first();
    await expect(ratesLink).toBeVisible();
    await expect(ratesLink).toHaveAttribute("href", /^https?:\/\//);
    await expect(page.locator("main, body")).not.toContainText(/\$\d/);
  });

  test("should offer the suggest-a-venue link", async ({ page }) => {
    await page.goto("/work");

    const addLink = page.getByRole("link", { name: /suggest a venue/i });
    await expect(addLink).toBeVisible();
    await expect(addLink).toHaveAttribute("href", /github\.com/);
  });

  test("should show a compact section on the homepage", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /WHERE TO WORK/ })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /all spots \+ day rates/i })
    ).toBeVisible();
  });
});
