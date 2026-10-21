import { test, expect } from "@playwright/test";

test.describe("/jobs", () => {
  test("intro, Slack link and the employers box always render", async ({
    page,
  }) => {
    await page.goto("/jobs");
    await expect(page).toHaveTitle(/jobs/i);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jobs");
    await expect(
      page.getByText("Locals post for free in our Slack's #jobs channel", {
        exact: false,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /join the Slack for #jobs/ })
    ).toHaveAttribute("href", "/slack");
    await expect(
      page.getByRole("heading", { name: "Hiring in Syracuse? Feature a role." })
    ).toBeVisible();
    for (const item of [
      "A listing on this site",
      "A place in the monthly email",
      "Pinned in #jobs on the Slack",
      "A mention at the next meetup",
    ]) {
      await expect(page.getByText(item)).toBeVisible();
    }
    // Same price as the featured-job card on /codes.
    await expect(page.getByText("$99 for 30 days")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "feature a role" })
    ).toHaveAttribute("data-track", "sponsor_contact");
  });

  test("never shows a zero count", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page.getByText(/\b0 (open )?(jobs|roles)\b/i)).toHaveCount(0);
    await expect(page.getByText(/no (open )?(jobs|roles)/i)).toHaveCount(0);
  });

  test("nav and open roles agree: jobs link only when there are roles", async ({
    page,
  }) => {
    await page.goto("/jobs");
    const roles = page.getByRole("heading", { name: "Open roles" });
    const navLink = page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "jobs" });
    if ((await roles.count()) === 0) {
      await expect(navLink).toHaveCount(0);
    } else {
      await expect(navLink).toHaveCount(1);
      // Featured roles are listed first.
      const labels = await page
        .locator("main li a")
        .evaluateAll((as) =>
          as.map((a) => a.textContent?.includes("Featured") ?? false)
        );
      expect([...labels].sort((a, b) => Number(b) - Number(a))).toEqual(labels);
    }
  });
});
