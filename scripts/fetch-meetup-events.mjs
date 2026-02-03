/**
 * Scrapes upcoming events from the Meetup.com group page using Playwright.
 *
 * Meetup's API requires a paid Pro subscription, so this script uses a headless
 * browser to load the public events page and extract structured event data from
 * the rendered DOM.
 *
 * Usage:
 *   npx playwright install chromium
 *   node scripts/fetch-meetup-events.mjs
 *
 * The script writes results to src/data/events.json.
 */

import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MEETUP_GROUP_URL =
  "https://www.meetup.com/syracuse-software-development-meetup/events/";
const OUTPUT_PATH = join(__dirname, "..", "src", "data", "events.json");

async function scrapeMeetupEvents() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log(`Fetching events from ${MEETUP_GROUP_URL}`);
  await page.goto(MEETUP_GROUP_URL, { waitUntil: "networkidle" });

  // Wait for event cards to render (Meetup is a React SPA)
  // Use a generous timeout — if no events exist the selector simply won't appear
  try {
    await page.waitForSelector("[id^='event-card']", { timeout: 15000 });
  } catch {
    console.log(
      "No event cards found — the group may have no upcoming events."
    );
    await browser.close();
    return [];
  }

  // Extract event data from the rendered page
  const events = await page.evaluate(() => {
    const cards = document.querySelectorAll("[id^='event-card']");
    return Array.from(cards).map((card) => {
      const linkEl = card.querySelector("a[href*='/events/']");
      const url = linkEl?.href || "";

      // Event title — usually an h2 or h3 inside the card
      const titleEl =
        card.querySelector('[data-testid="event-card-title"]') ||
        card.querySelector("h2") ||
        card.querySelector("h3");
      const name = titleEl?.textContent?.trim() || "";

      // Date/time — look for <time> element
      const timeEl = card.querySelector("time");
      const dateTime = timeEl?.getAttribute("datetime") || "";
      const dateDisplay = timeEl?.textContent?.trim() || "";

      // Description — paragraph text in the card
      const descEl =
        card.querySelector('[data-testid="event-card-description"]') ||
        card.querySelector("p");
      const description = descEl?.textContent?.trim() || "";

      // Event image
      const imgEl = card.querySelector("img");
      const imageSource = imgEl?.src || "";

      // Venue info
      const venueEl =
        card.querySelector('[data-testid="venue-name"]') ||
        card.querySelector(".venueDisplay");
      const venueName = venueEl?.textContent?.trim() || "";

      // Host info
      const hostEl = card.querySelector('[data-testid="event-card-host"]');
      const hostName = hostEl?.textContent?.trim() || "";
      const hostImgEl = hostEl?.querySelector("img");
      const hostPhoto = hostImgEl?.src || "";

      return {
        name,
        description,
        dateTime,
        dateDisplay,
        url,
        images: imageSource
          ? [{ baseUrl: imageSource, source: imageSource }]
          : [],
        venue: venueName
          ? {
              name: venueName,
              address: "",
              city: "Syracuse",
              state: "NY",
              postalCode: "",
              venueType: "physical",
            }
          : null,
        host: {
          name: hostName || "Syracuse Software Development Meetup",
          memberPhoto: { source: hostPhoto },
        },
        hostPhoto: { source: hostPhoto },
      };
    });
  });

  await browser.close();
  return events;
}

try {
  const events = await scrapeMeetupEvents();
  console.log(`Found ${events.length} upcoming event(s).`);

  writeFileSync(OUTPUT_PATH, JSON.stringify(events, null, 2) + "\n");
  console.log(`Events written to ${OUTPUT_PATH}`);
} catch (error) {
  console.error("Failed to scrape Meetup events:", error);
  process.exit(1);
}
