import { test, expect } from "@playwright/test";

test.describe("/codes", () => {
  test("title, h1 and mission line", async ({ page }) => {
    await page.goto("/codes");
    await expect(page).toHaveTitle("CODES, the nonprofit behind syracuse.io");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "CODES Coalition of Digital Engagement in Syracuse"
    );
    await expect(
      page.getByText("serves and grows Syracuse's tech community")
    ).toBeVisible();
  });

  test("sections appear in the specified order", async ({ page }) => {
    await page.goto("/codes");
    const headings = await page.locator("main h2").allTextContents();
    expect(headings.map((h) => h.trim())).toEqual([
      "How this started",
      "Connections since 2014",
      "Why it matters",
      "By the numbers",
      "Run something with us",
      "Have an idea?",
      "Paying for it",
      "Board",
      "Legal",
    ]);
  });

  test("sponsorship lives on /sponsor, not here", async ({ page }) => {
    await page.goto("/codes");
    const main = page.locator("main");
    await expect(main.getByText("you give")).toHaveCount(0);
    await expect(main).not.toContainText("tax-deductible");
    await expect(
      page.getByRole("link", { name: "See sponsorship options →" })
    ).toHaveAttribute("href", "/sponsor");
  });

  test("numbers link to Meetup and the Slack", async ({ page }) => {
    await page.goto("/codes");
    await expect(page.getByText("as of Oct 2026")).toBeVisible();
    await expect(page.getByText("April 2014", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "1,500+" })).toHaveAttribute(
      "href",
      "https://www.meetup.com/syracuse-software-development-meetup/members/"
    );
    await expect(page.getByRole("link", { name: "750+" })).toHaveAttribute(
      "href",
      "/slack"
    );
  });

  test("ideas go to hi@syracuse.io", async ({ page }) => {
    await page.goto("/codes");
    await expect(
      page.locator("main").getByRole("link", { name: "hi@syracuse.io" })
    ).toHaveAttribute("href", /^mailto:hi@syracuse\.io\?subject=/);
    await expect(page.locator("main")).not.toContainText("mike@syracuse.io");
  });

  test("board, legal and story are filled in", async ({ page }) => {
    await page.goto("/codes");
    const main = page.locator("main");
    for (const fact of [
      "Mike Vormwald",
      "Annalena Davis",
      "Ed Forth",
      "Coalition of Digital Engagement in Syracuse, Inc.",
      "85-2136324",
      "In 2020 a group of us",
      "hired three people he met at Open Hack",
    ]) {
      await expect(main).toContainText(fact);
    }
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
    expect(org.email).toBe("hi@syracuse.io");
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
