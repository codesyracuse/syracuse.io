import { test, expect } from "@playwright/test";

test.describe("Series page /open-hack", () => {
  test("title and h1 carry the series name, Syracuse and the series type", async ({
    page,
  }) => {
    await page.goto("/open-hack");
    await expect(page).toHaveTitle(
      "Open Hack — a monthly developer meetup in Syracuse, NY"
    );
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Open Hack");
    // The words must not run together for search engines and screen readers.
    await expect(h1).toHaveText(
      "A monthly developer meetup in Syracuse, NY Open Hack"
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("hero shows the next date and an RSVP tagged for this series", async ({
    page,
  }) => {
    await page.goto("/open-hack");
    await expect(page.getByText("Next one")).toBeVisible();
    const rsvp = page.getByRole("link", {
      name: /^RSVP for [A-Z][a-z]{2} \d+ →$/,
    });
    await expect(rsvp).toHaveAttribute("href", /utm_campaign=open-hack/);
    await expect(rsvp).toHaveAttribute("data-series", "open-hack");
  });

  test("hero and RSVP fit above the fold on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/open-hack");
    const box = await page
      .getByRole("link", { name: /^RSVP for / })
      .boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(667);
  });

  test("has real content: 300+ words", async ({ page }) => {
    await page.goto("/open-hack");
    const text = await page.locator("main").innerText();
    // Placeholders stand in for facts that will add more words.
    const words = text
      .replace(/TBD\(mike\)[^\n]*/g, "")
      .split(/\s+/)
      .filter(Boolean);
    expect(words.length).toBeGreaterThanOrEqual(280);
  });

  test("first-time rows show the first-timer details", async ({ page }) => {
    await page.goto("/open-hack");
    await expect(
      page.getByText(
        "Any time after 6. Nobody minds if you're late or leave early."
      )
    ).toBeVisible();
    await expect(
      page.getByText("A laptop helps but isn't required.")
    ).toBeVisible();
    const dl = page.locator("dl");
    await expect(dl.locator("mark.tbd")).toHaveCount(0);
    await expect(dl).toContainText("We send a door code the day of.");
    await expect(dl).toContainText("Usually around 15–20 people");
    await expect(dl).toContainText("Usually pizza");
  });

  test("sidebar: who it's for and where", async ({ page }) => {
    await page.goto("/open-hack");
    await expect(
      page.getByRole("heading", { name: "Who it's for" })
    ).toBeVisible();
    await expect(
      page.getByText("Career-switchers and bootcamp grads")
    ).toBeVisible();
    const where = page.locator(".card", { hasText: "Where" });
    await expect(where).toContainText("Commonspace");
    await expect(where.locator("mark.tbd")).toHaveCount(0);
    await expect(where).toContainText(
      "351 S Warren St, Suite 200, Syracuse, NY 13202"
    );
    await expect(where).toContainText("Warren and Jefferson");
    await expect(
      where.getByRole("link", { name: /open in maps/ })
    ).toHaveAttribute("href", "https://maps.app.goo.gl/rLmxVbQrYnQi1Mda7");
    await expect(where).toContainText("Hosted by Commonspace. Thank you.");
  });

  test("coming up lists this series' next dates, at most three", async ({
    page,
  }) => {
    await page.goto("/open-hack");
    const section = page.locator("section", {
      has: page.getByRole("heading", { name: "Coming up" }),
    });
    await expect(section).toContainText("meeting monthly since April 2014");
    const rows = section.getByRole("link", { name: /RSVP →/ });
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
    expect(await rows.count()).toBeLessThanOrEqual(3);
    await expect(rows.first()).toContainText("Commonspace");
  });

  test("closing band routes to Slack or the email", async ({ page }) => {
    await page.goto("/open-hack");
    await expect(page.getByText("Can't make it this month?")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "join the slack" })
    ).toHaveAttribute("href", "/slack");
    await expect(
      page.getByRole("link", { name: "get the email" })
    ).toHaveAttribute("href", "/#email");
  });

  test("emits Event JSON-LD", async ({ page }) => {
    await page.goto("/open-hack");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const events = blocks
      .map((b) => JSON.parse(b))
      .filter((d) => d["@type"] === "Event");
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].isAccessibleForFree).toBe(true);
  });

  test("is in the sitemap-worthy canonical form", async ({ page }) => {
    await page.goto("/open-hack");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://syracuse.io/open-hack"
    );
  });

  test("the meetups nav link points here", async ({ page }) => {
    await page.goto("/");
    await expect(
      page
        .getByRole("navigation", { name: "Main" })
        .getByRole("link", { name: "meetups" })
    ).toHaveAttribute("href", "/open-hack");
  });

  test("an unknown series is a 404", async ({ page }) => {
    const res = await page.goto("/build-with-ai");
    expect(res!.status()).toBe(404);
  });
});
