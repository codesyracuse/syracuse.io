import { test, expect } from "@playwright/test";

test.describe("Layout", () => {
  test("header has the wordmark, nav and RSVP button", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(
      page.getByRole("link", { name: "syracuse.io" }).first()
    ).toBeVisible();
    await expect(nav.getByRole("link", { name: "meetups" })).toHaveAttribute(
      "href",
      "/open-hack"
    );
    await expect(nav.getByRole("link", { name: "codes" })).toHaveAttribute(
      "href",
      "/codes"
    );
    await expect(nav.getByRole("link", { name: "sponsor" })).toHaveAttribute(
      "href",
      "/sponsor"
    );
    await expect(nav.getByRole("link", { name: "RSVP" })).toBeVisible();
  });

  test("RSVP goes to the next event on its platform, tagged for analytics", async ({
    page,
  }) => {
    await page.goto("/");
    const rsvp = page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "RSVP" });
    // Falls back to the email signup if the feed has nothing scheduled.
    await expect(rsvp).toHaveAttribute(
      "href",
      /^(\/#email|https:\/\/www\.meetup\.com\/.+utm_source=syracuse\.io.+utm_campaign=open-hack)/
    );
  });

  test("jobs is hidden from the nav when there are no active jobs", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "jobs" })
    ).toHaveCount(0);
  });

  test("footer links and run-by line", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "slack" })).toHaveAttribute(
      "href",
      "/slack"
    );
    await expect(
      footer.getByRole("link", { name: "code of conduct" })
    ).toBeVisible();
    await expect(footer.getByRole("link", { name: "privacy" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "sponsor" })).toHaveAttribute(
      "href",
      "/sponsor"
    );
    await expect(footer).toContainText("run by CODES, a 501(c)(3) nonprofit");
  });

  test("footer has the general contact address", async ({ page }) => {
    await page.goto("/");
    await expect(
      page
        .getByRole("contentinfo")
        .getByRole("link", { name: "hi@syracuse.io" })
    ).toHaveAttribute("href", "mailto:hi@syracuse.io");
  });

  test("design tokens are applied", async ({ page }) => {
    await page.goto("/");
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bg).toBe("rgb(241, 242, 238)"); // --salt
    const plow = await page
      .getByRole("link", { name: "syracuse.io" })
      .first()
      .locator("span")
      .evaluate((el) => getComputedStyle(el).color);
    expect(plow).toBe("rgb(237, 178, 48)"); // --plow
  });

  for (const path of ["/", "/open-hack", "/codes", "/sponsor", "/privacy"]) {
    test(`${path}: links on dark bands stay light on hover`, async ({
      page,
    }) => {
      await page.goto(path);
      const links = page.locator(
        ".bg-ink a:not(.btn), .bg-steel a:not(.btn), footer a"
      );
      expect(await links.count()).toBeGreaterThan(0);
      for (const link of await links.all()) {
        if (!(await link.isVisible())) continue;
        await link.hover();
        const color = await link.evaluate((el) => getComputedStyle(el).color);
        expect(color, await link.innerText()).not.toBe("rgb(27, 33, 31)"); // --ink
      }
    });
  }

  test("code of conduct renders in the prose layout", async ({ page }) => {
    await page.goto("/code-of-conduct");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Code of Conduct"
    );
    await expect(page).toHaveTitle(/Code of Conduct/);
  });
});

test.describe("Small phones", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  for (const path of [
    "/",
    "/open-hack",
    "/codes",
    "/sponsor",
    "/jobs",
    "/privacy",
    "/code-of-conduct",
  ]) {
    test(`${path} doesn't scroll sideways at 320px`, async ({ page }) => {
      await page.goto(path);
      const width = await page.evaluate(
        () => document.documentElement.scrollWidth
      );
      expect(width).toBeLessThanOrEqual(320);
    });
  }

  test("head links the favicon, touch icon and share image", async ({
    page,
  }) => {
    await page.goto("/");
    for (const href of [
      "/favicon.svg",
      "/favicon.png",
      "/apple-touch-icon.png",
    ]) {
      expect((await page.request.get(href)).ok()).toBe(true);
    }
    const og = page.locator('meta[property="og:image"]');
    await expect(og).toHaveAttribute("content", "https://syracuse.io/og.png");
    expect((await page.request.get("/og.png")).ok()).toBe(true);
  });
});
