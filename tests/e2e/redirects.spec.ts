import { test, expect } from "@playwright/test";

async function redirect(
  request: import("@playwright/test").APIRequestContext,
  path: string
) {
  const res = await request.get(path, { maxRedirects: 0 });
  return { status: res.status(), location: res.headers()["location"] };
}

test.describe("Redirects", () => {
  test("/slack goes to the Slack invite", async ({ request }) => {
    const { status, location } = await redirect(request, "/slack");
    expect(status).toBe(302);
    expect(location).toMatch(/^https:\/\/join\.slack\.com\//);
  });

  test("/email goes to the signup on home", async ({ request }) => {
    const { status, location } = await redirect(request, "/email");
    expect(status).toBe(301);
    expect(location).toMatch(/\/#email$/);
  });

  for (const from of ["/support", "/sponsor", "/about"]) {
    test(`${from} goes to /codes`, async ({ request }) => {
      const { status, location } = await redirect(request, from);
      expect(status).toBe(301);
      expect(location).toMatch(/\/codes$/);
    });
  }

  for (const from of [
    "/groups",
    "/groups/open-hack",
    "/groups/open-hack/",
    "/community",
    "/resources",
    "/start",
  ]) {
    test(`old page ${from} goes to home`, async ({ request }) => {
      const { status, location } = await redirect(request, from);
      expect(status).toBe(301);
      expect(location).toMatch(/^(https?:\/\/[^/]+)?\/$/);
    });
  }

  test("/events goes to the upcoming list", async ({ request }) => {
    const { status, location } = await redirect(request, "/events");
    expect(status).toBe(301);
    expect(location).toMatch(/\/#upcoming$/);
  });

  test("old job pages go to /jobs", async ({ request }) => {
    const { status, location } = await redirect(request, "/jobs/some-old-job");
    expect(status).toBe(301);
    expect(location).toMatch(/\/jobs$/);
  });

  test("/jobs itself is not redirected", async ({ request }) => {
    const res = await request.get("/jobs", { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });
});
