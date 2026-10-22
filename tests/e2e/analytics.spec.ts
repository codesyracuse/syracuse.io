import { test, expect, type Page } from "@playwright/test";

const GOOGLE = "**/www.googletagmanager.com/**";

/** Everything pushed to gtag so far, as plain arrays. */
function calls(page: Page) {
  return page.evaluate(() =>
    (
      (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer ??
      []
    ).map((a) => Array.from(a))
  );
}

async function events(page: Page) {
  return (await calls(page))
    .filter((c) => c[0] === "event")
    .map((c) => ({
      name: c[1] as string,
      params: c[2] as Record<string, string>,
    }));
}

// Cancel the link's navigation (after the tracker has seen the click) so the
// dataLayer survives for inspection.
async function stayOnPage(page: Page) {
  await page.evaluate(() =>
    document.addEventListener("click", (e) => e.preventDefault(), true)
  );
}

test.describe("Analytics", () => {
  test("configures GA4 and Google Ads, and loads gtag.js after the page is ready", async ({
    page,
  }) => {
    const loaded = page.waitForRequest(
      /googletagmanager\.com\/gtag\/js\?id=G-TEST000000/
    );
    await page.route(GOOGLE, (route) =>
      route.fulfill({ body: "", contentType: "text/javascript" })
    );
    await page.goto("/");
    await loaded;
    const configs = (await calls(page))
      .filter((c) => c[0] === "config")
      .map((c) => c[1]);
    expect(configs).toEqual(["G-TEST000000", "AW-000000000"]);
  });

  test("does nothing when Do Not Track is on", async ({ page }) => {
    let googleRequests = 0;
    await page.route(GOOGLE, (route) => {
      googleRequests++;
      return route.fulfill({ body: "" });
    });
    await page.addInitScript(() =>
      Object.defineProperty(navigator, "doNotTrack", { value: "1" })
    );
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
    expect(await calls(page)).toEqual([]);
    expect(googleRequests).toBe(0);
  });

  test("does nothing when Global Privacy Control is on", async ({ page }) => {
    await page.addInitScript(() =>
      Object.defineProperty(navigator, "globalPrivacyControl", { value: true })
    );
    await page.goto("/");
    await page.waitForTimeout(300);
    expect(await calls(page)).toEqual([]);
  });

  test("rsvp_click carries series and provider, and fires the Ads conversion", async ({
    page,
  }) => {
    await page.route(GOOGLE, (route) => route.fulfill({ body: "" }));
    await page.goto("/");
    await stayOnPage(page);
    await page.getByRole("link", { name: /^RSVP for / }).click();
    const sent = await events(page);
    expect(sent).toContainEqual({
      name: "rsvp_click",
      params: expect.objectContaining({
        series: "open-hack",
        provider: "meetup",
      }),
    });
    expect(sent).toContainEqual({
      name: "conversion",
      params: { send_to: "AW-000000000/rsvp" },
    });
  });

  test("the nav RSVP button is tracked too", async ({ page }) => {
    await page.goto("/open-hack");
    await stayOnPage(page);
    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "RSVP" })
      .click();
    expect((await events(page)).map((e) => e.name)).toContain("rsvp_click");
  });

  test("slack_click fires for any link to /slack", async ({ page }) => {
    await page.goto("/");
    await stayOnPage(page);
    await page.getByRole("link", { name: "get an invite" }).click();
    expect((await events(page)).map((e) => e.name)).toContain("slack_click");
  });

  test("sponsor_contact fires from /sponsor with the way they asked about", async ({
    page,
  }) => {
    await page.goto("/sponsor");
    await stayOnPage(page);
    await page.getByRole("link", { name: "ask about this →" }).first().click();
    expect(await events(page)).toContainEqual({
      name: "sponsor_contact",
      params: expect.objectContaining({ way: "host" }),
    });
  });

  test("email_signup fires only after a successful submit", async ({
    page,
  }) => {
    // Never subscribe anyone for real.
    await page.route("https://buttondown.com/**", (route) =>
      route.fulfill({ status: 200, body: "ok" })
    );
    await page.goto("/");
    // Nothing is reported for an invalid submit.
    await page.getByRole("button", { name: "sign up" }).click();
    expect((await events(page)).map((e) => e.name)).not.toContain(
      "email_signup"
    );

    await page.getByLabel("Email address").fill("someone@example.com");
    await page.getByRole("button", { name: "sign up" }).click();
    await expect(page.getByRole("status")).toContainText("Check your email");
    const names = (await events(page)).map((e) => e.name);
    expect(names).toContain("email_signup");
    expect(await events(page)).toContainEqual({
      name: "conversion",
      params: { send_to: "AW-000000000/email" },
    });
  });
});

test.describe("Email form", () => {
  test("posts natively to the provider's action until JS enhances it", async ({
    page,
  }) => {
    await page.goto("/");
    const form = page.locator("form#email");
    await expect(form).toHaveAttribute("method", "post");
    await expect(form).toHaveAttribute(
      "action",
      "https://buttondown.com/api/emails/embed-subscribe/syracuseio"
    );
    await expect(form.locator('input[name="email"]')).toBeVisible();
  });
});
