/**
 * Scrapes upcoming events from the Meetup.com group page using Playwright.
 *
 * Meetup's API requires a paid Pro subscription, so this script uses a headless
 * browser to load the public events page and extract structured event data from
 * the rendered DOM.
 *
 * Scraped events are merged with the existing events.json — historical events
 * are preserved and new/updated upcoming events are added or refreshed.
 *
 * Usage:
 *   npx playwright install chromium
 *   node scripts/fetch-meetup-events.mjs
 *
 * The script writes results to src/data/events.json.
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
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
  await page.goto(MEETUP_GROUP_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

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

function classifyEvent(title) {
  const t = title.toLowerCase();
  if (t.includes("openhack") || t.includes("open hack")) return "open-hack";
  if (
    t.includes("syracuse javascript") ||
    t.includes("syr(js)") ||
    t.includes("syrjs")
  )
    return "syr-js";
  if (t.includes("women in coding") || t.startsWith("wic "))
    return "women-in-coding";
  if (t.includes("/dev/drinks") || t.includes("developer happy hour"))
    return "dev-drinks";
  if (t.includes("hack upstate")) return "hack-upstate";
  if (t.includes("book club") || t.includes("fight club")) return "book-club";
  if (
    t.includes("coworking") ||
    t.includes("common space day") ||
    t.includes("commonspace")
  )
    return "coworking";
  return "other";
}

function mergeEvents(existing, scraped) {
  // Index existing events by URL for deduplication
  const byUrl = new Map(existing.map((e) => [e.url, e]));

  // Upsert scraped events (new ones get added, existing ones get refreshed)
  for (const event of scraped) {
    if (event.url) {
      byUrl.set(event.url, event);
    }
  }

  // Sort newest first
  return Array.from(byUrl.values()).sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );
}

try {
  const scraped = await scrapeMeetupEvents();
  for (const event of scraped) {
    event.groupId = classifyEvent(event.name);
  }
  console.log(`Scraped ${scraped.length} upcoming event(s).`);

  // Load existing events to preserve historical data
  let existing = [];
  try {
    existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
  } catch {
    console.log("No existing events file found, starting fresh.");
  }

  const merged = mergeEvents(existing, scraped);
  console.log(
    `Merged result: ${merged.length} total events (was ${existing.length}).`
  );

  writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2) + "\n");
  console.log(`Events written to ${OUTPUT_PATH}`);
} catch (error) {
  console.error("Failed to scrape Meetup events:", error);
  process.exit(1);
}
