import { test, expect } from "@playwright/test";

test.describe("CODES page", () => {
  test("should describe the nonprofit", async ({ page }) => {
    await page.goto("/codes");

    await expect(page.locator("h1")).toContainText("CODES");
    await expect(
      page.getByText(/Coalition of Digital Engagements/i).first()
    ).toBeVisible();
    await expect(page.getByText(/501\(c\)\(3\)/).first()).toBeVisible();
  });

  test("should list the board", async ({ page }) => {
    await page.goto("/codes");

    for (const name of ["Mike Vormwald", "Annalena Davis", "Ed Forth"]) {
      await expect(page.getByText(name)).toBeVisible();
    }
  });

  test("should show sponsorship tiers with a contact CTA", async ({ page }) => {
    await page.goto("/codes");

    await expect(page.getByText("$250")).toBeVisible();
    await expect(page.getByText("$1,500")).toBeVisible();
    const cta = page.getByRole("link", { name: /sponsor or donate/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", /hi@codesyracuse\.org/);
  });
});

test.describe("Newsletter signup", () => {
  test("footer form posts to Buttondown", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("footer form");
    await expect(form).toHaveAttribute(
      "action",
      /buttondown\.com\/api\/emails\/embed-subscribe\/syracuseio/
    );
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(
      form.getByRole("button", { name: /subscribe/i })
    ).toBeVisible();
  });
});
