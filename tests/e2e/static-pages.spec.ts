import { test, expect } from "@playwright/test";

const PAGES = [
  "/",
  "/open-hack",
  "/codes",
  "/jobs",
  "/code-of-conduct",
  "/privacy",
];

test.describe("Every page", () => {
  for (const path of PAGES) {
    test(`${path} has one h1, a title, a description and a canonical URL`, async ({
      page,
    }) => {
      const res = await page.goto(path);
      expect(res!.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /.{40,}/
      );
      const expected =
        path === "/" ? "https://syracuse.io/" : `https://syracuse.io${path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        expected
      );
    });

    test(`${path} ends in a clear next action`, async ({ page }) => {
      await page.goto(path);
      // The footer always offers RSVP, Slack and the monthly email.
      const footer = page.getByRole("contentinfo");
      await expect(footer.getByRole("link", { name: "rsvp" })).toBeVisible();
      await expect(footer.getByRole("link", { name: "slack" })).toBeVisible();
      await expect(
        footer.getByRole("link", { name: "monthly email" })
      ).toBeVisible();
    });
  }
});

test.describe("Privacy", () => {
  test("covers analytics, conversion tracking, Do Not Track and the email provider", async ({
    page,
  }) => {
    await page.goto("/privacy");
    const text = await page.locator("article").innerText();
    expect(text).toMatch(/Google Analytics/);
    expect(text).toMatch(/Google Ads/);
    expect(text).toMatch(/conversion/i);
    expect(text).toMatch(/Do Not Track/);
    expect(text).toMatch(/Buttondown/);
    // The general contact address is still Mike's to fill in.
    expect(text).toMatch(/TBD\(mike\)/);
  });

  test("no longer claims there is no tracking", async ({ page }) => {
    await page.goto("/privacy");
    const text = await page.locator("article").innerText();
    expect(text).not.toMatch(/do not set advertising or tracking cookies/i);
    expect(text).not.toMatch(/do not run behavioral advertising/i);
  });
});

test.describe("Crawling", () => {
  test("robots.txt allows crawling and points at the sitemap", async ({
    request,
  }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toMatch(/User-agent: \*/);
    expect(body).toMatch(/Allow: \//);
    expect(body).not.toMatch(/Disallow: \/\s*$/m);
    expect(body).toMatch(/Sitemap: https:\/\/syracuse\.io\/sitemap\.xml/);
  });

  test("sitemap lists every public page", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    for (const path of PAGES) {
      const loc =
        path === "/" ? "https://syracuse.io/" : `https://syracuse.io${path}`;
      expect(body).toContain(`<loc>${loc}</loc>`);
    }
  });
});

test.describe("404", () => {
  test("unknown URLs get a real 404 page with a way back", async ({ page }) => {
    const res = await page.goto("/no-such-page");
    expect(res!.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Page not found"
    );
    await expect(
      page.getByRole("link", { name: /see the next meetup/ })
    ).toHaveAttribute("href", "/");
  });
});
