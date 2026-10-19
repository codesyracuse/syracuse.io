import { test, expect } from "@playwright/test";

test.describe("/codes", () => {
  test("title, h1 and mission", async ({ page }) => {
    await page.goto("/codes");
    await expect(page).toHaveTitle(/CODES/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "CODES"
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Coalition of Digital Engagement in Syracuse"
    );
    await expect(
      page.getByText("We aim to break even, not to grow an organization.")
    ).toBeVisible();
  });

  test("sections appear in the specified order", async ({ page }) => {
    await page.goto("/codes");
    const headings = await page.locator("main h2").allTextContents();
    expect(headings.map((h) => h.trim())).toEqual([
      "Mission",
      "What it costs",
      "Ways to support",
      "Current hosts and partners",
      "Board",
      "Legal",
      "Want to host, sponsor or partner?",
      "History",
    ]);
  });

  test("four ways to support, each with what you give and get", async ({
    page,
  }) => {
    await page.goto("/codes");
    for (const name of [
      "Host",
      "Event sponsor",
      "Featured job",
      "Annual partner",
    ]) {
      await expect(page.getByRole("heading", { name, level: 3 })).toBeVisible();
    }
    await expect(page.getByText("you give")).toHaveCount(4);
    await expect(page.getByText("you get")).toHaveCount(4);
    // Hosting is in-kind; the other three prices are Mike's to set.
    await expect(page.getByText("In-kind")).toBeVisible();
    await expect(page.locator("mark.tbd", { hasText: "price" })).toHaveCount(3);
  });

  test("every contact link is tracked as sponsor_contact", async ({ page }) => {
    await page.goto("/codes");
    const links = page.locator('main a[href^="mailto:"]');
    expect(await links.count()).toBe(5);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("data-track", "sponsor_contact");
      await expect(link).toHaveAttribute(
        "href",
        /^mailto:mike@syracuse\.io\?subject=/
      );
    }
  });

  test("facts only Mike can supply are visible placeholders", async ({
    page,
  }) => {
    await page.goto("/codes");
    const labels = await page.locator("main mark.tbd").allTextContents();
    for (const expected of [
      "approve the mission wording",
      "per-event cost",
      "what the money pays for",
      "board names and roles",
      "confirm tax-deductibility wording",
      "EIN",
      "founding year",
    ]) {
      expect(labels.some((l) => l.includes(expected))).toBe(true);
    }
  });

  test("lists current hosts", async ({ page }) => {
    await page.goto("/codes");
    const section = page.locator("section", {
      has: page.getByRole("heading", { name: "Current hosts and partners" }),
    });
    await expect(section).toContainText("Commonspace");
  });

  test("history credits April 2014", async ({ page }) => {
    await page.goto("/codes");
    await expect(page.getByText(/every month since April 2014/)).toBeVisible();
  });

  test("emits nonprofit Organization JSON-LD without placeholders", async ({
    page,
  }) => {
    await page.goto("/codes");
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const org = raw
      .map((r) => JSON.parse(r))
      .find((d) => d["@type"] === "NonprofitOrganization");
    expect(org.alternateName).toBe("CODES");
    expect(org.nonprofitStatus).toBe("https://schema.org/Nonprofit501c3");
    expect(JSON.stringify(org)).not.toContain("TBD(mike)");
  });

  test("the codes nav link is marked current", async ({ page }) => {
    await page.goto("/codes");
    await expect(
      page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "codes" })
    ).toHaveAttribute("aria-current", "page");
  });
});
