import { test, expect } from "@playwright/test";

test.describe("/sponsor", () => {
  test("title and h1", async ({ page }) => {
    await page.goto("/sponsor");
    await expect(page).toHaveTitle("Sponsor syracuse.io");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Sponsor syracuse.io"
    );
  });

  test("sections appear in the specified order", async ({ page }) => {
    await page.goto("/sponsor");
    const headings = await page.locator("main h2").allTextContents();
    expect(headings.map((h) => h.trim())).toEqual([
      "Who you reach",
      "What it costs to run",
      "Ways to support",
      "Current hosts and partners",
      "Chip in",
      "Want to host, sponsor or partner?",
    ]);
  });

  test("four tiers, each linkable, with what you give, get and pay", async ({
    page,
  }) => {
    await page.goto("/sponsor");
    for (const [id, name, price] of [
      ["host", "Host", "In-kind"],
      ["event-sponsor", "Event sponsor", "$200 a meetup"],
      ["featured-job", "Featured job", "$99 for 30 days"],
      ["annual-partner", "Annual partner", "$1,500 a year"],
    ]) {
      const card = page.locator(`#${id}`);
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(name);
      await expect(card.getByText("you give")).toBeVisible();
      await expect(card.getByText("you get")).toBeVisible();
      await expect(card.getByText(price, { exact: true })).toBeVisible();
      await expect(
        card.getByRole("link", { name: "ask about this →" })
      ).toHaveAttribute(
        "href",
        `mailto:hi@syracuse.io?subject=${encodeURIComponent(`Sponsoring syracuse.io: ${name}`)}`
      );
    }
  });

  test("every contact link goes to hi@ and is tracked", async ({ page }) => {
    await page.goto("/sponsor");
    const links = page.locator('main a[href^="mailto:"]');
    expect(await links.count()).toBe(5);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("data-track", "sponsor_contact");
      await expect(link).toHaveAttribute(
        "href",
        /^mailto:hi@syracuse\.io\?subject=/
      );
    }
  });

  test("the tax line appears only under chip in", async ({ page }) => {
    await page.goto("/sponsor");
    await expect(page.getByText("tax-deductible")).toHaveCount(1);
    const chipIn = page.locator("#chip-in");
    await expect(chipIn.getByRole("heading")).toHaveText("Chip in");
    await expect(chipIn).toContainText("tax-deductible");
    await expect(
      chipIn.getByRole("link", { name: "chip in on Givebutter" })
    ).toHaveAttribute("href", "https://givebutter.com/codesyracuse");
  });

  test("lists current hosts with an open slot", async ({ page }) => {
    await page.goto("/sponsor");
    const section = page.locator("section", {
      has: page.getByRole("heading", { name: "Current hosts and partners" }),
    });
    await expect(section).toContainText("Commonspace");
    await expect(
      section.getByRole("link", { name: "your company here →" })
    ).toHaveAttribute("href", "#annual-partner");
  });

  test("ends with the legal line and has no placeholders", async ({ page }) => {
    await page.goto("/sponsor");
    const main = page.locator("main");
    await expect(main).toContainText("EIN 85-2136324");
    await expect(main.locator("mark.tbd")).toHaveCount(0);
  });

  test("prints light, without navigation, cards kept whole", async ({
    page,
  }) => {
    await page.goto("/sponsor");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
    await expect(page.getByRole("contentinfo")).toBeHidden();
    const heroBg = await page
      .locator("body > div")
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(heroBg).toBe("rgb(255, 255, 255)");
    const breakInside = await page
      .locator("#host")
      .evaluate((el) => getComputedStyle(el).breakInside);
    expect(breakInside).toBe("avoid");
    const after = await page
      .locator("#host a")
      .evaluate((el) => getComputedStyle(el, "::after").content);
    expect(after).toContain("hi@syracuse.io");
  });
});
