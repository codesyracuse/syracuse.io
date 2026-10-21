import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("title and headline", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Syracuse, NY/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Syracuse's developer community. Every month since April 2014."
    );
  });

  test("hero leads with the next date and an RSVP button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/^Next up · /)).toBeVisible();
    const rsvp = page.getByRole("link", {
      name: /^RSVP for [A-Z][a-z]{2} \d+ →$/,
    });
    await expect(rsvp).toHaveAttribute(
      "href",
      /meetup\.com\/.+utm_source=syracuse\.io&utm_medium=site&utm_campaign=open-hack/
    );
    await expect(rsvp).toHaveAttribute("data-track", "rsvp");
    await expect(rsvp).toHaveAttribute("data-provider", "meetup");
  });

  test("date and RSVP are above the fold on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const rsvp = page.getByRole("link", { name: /^RSVP for / });
    const box = await rsvp.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(667);
    // The day name is the one place plow appears in the hero.
    const day = page.locator("section#rsvp span.text-plow");
    await expect(day).toHaveText(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/);
  });

  test("never says there are no events", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/no (upcoming )?events/i)).toHaveCount(0);
  });

  test("upcoming list names its source from the provider", async ({ page }) => {
    await page.goto("/");
    const upcoming = page.locator("#upcoming");
    // Hidden when fewer than 2 events follow the hero's.
    if ((await upcoming.count()) === 0) return;
    await expect(upcoming.getByText("via Meetup")).toBeVisible();
    const rows = upcoming.getByRole("link", { name: /RSVP →/ });
    expect(await rows.count()).toBeGreaterThanOrEqual(2);
    expect(await rows.count()).toBeLessThanOrEqual(4);
    await expect(rows.first()).toContainText("Open Hack");
    await expect(rows.first()).toContainText(
      /(MON|TUE|WED|THU|FRI|SAT|SUN) \d\d·\d\d/
    );
  });

  test("series card links to the series page", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("link", { name: /Open Hack.*details →/s });
    await expect(card).toHaveAttribute("href", "/open-hack");
    await expect(card).toContainText("at Commonspace");
  });

  test("three ways in", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Come to a meetup" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "get an invite" })
    ).toHaveAttribute("href", "/slack");
    const form = page.locator("form#email");
    await expect(form.getByLabel("Email address")).toBeVisible();
    await expect(form.getByRole("button", { name: "sign up" })).toBeVisible();
    await expect(form.locator("mark.tbd")).toHaveCount(0);
  });

  test("photos section is hidden until there are photos", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("figure")).toHaveCount(0);
  });

  test("CODES popover opens, links to /codes, and closes on Escape", async ({
    page,
  }) => {
    await page.goto("/");
    const pop = page.locator("#codes-pop");
    await expect(pop).toBeHidden();
    await page.getByRole("button", { name: "CODES" }).click();
    await expect(pop).toBeVisible();
    await expect(pop).toContainText("501(c)(3) nonprofit");
    await expect(
      pop.getByRole("link", { name: /see more at \/codes/ })
    ).toHaveAttribute("href", "/codes");
    await page.keyboard.press("Escape");
    await expect(pop).toBeHidden();
  });

  test("CODES popover closes on outside click", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "CODES" }).click();
    await expect(page.locator("#codes-pop")).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(page.locator("#codes-pop")).toBeHidden();
  });

  test("Mike's card has a working email link", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "mike@syracuse.io" })
    ).toHaveAttribute("href", "mailto:mike@syracuse.io");
  });

  test("made possible by lists hosts and links to /codes", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#support");
    await expect(section).toContainText("Commonspace");
    await expect(
      section.getByRole("link", { name: "support syracuse.io →" })
    ).toHaveAttribute("href", "/codes");
  });

  test("emits Event JSON-LD for upcoming events", async ({ page }) => {
    await page.goto("/");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const events = blocks
      .map((b) => JSON.parse(b))
      .filter((d) => d["@type"] === "Event");
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].location.address).toMatchObject({
      streetAddress: "351 S Warren St, Suite 200",
      postalCode: "13202",
      addressLocality: "Syracuse",
    });
  });

  test("works with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("link", { name: /^RSVP for / })).toBeVisible();
    await context.close();
  });
});
