import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const md = (base: string) =>
  glob({ pattern: "**/*.{md,mdx}", base: `./src/content/${base}` });

// One page per meetup series. The body is the series page prose.
const series = defineCollection({
  loader: md("series"),
  schema: z.object({
    name: z.string(),
    active: z.boolean().default(false),
    rhythm: z.string(),
    since: z
      .string()
      .regex(/^\d{4}-\d{2}$/, "YYYY-MM")
      .optional(),
    time: z.string(),
    venue: reference("venues"),
    summary: z.string(),
    // Substring (case-insensitive) or /regex/ matched against feed event titles.
    match: z.string(),
    seo_title: z.string(),
    seo_description: z.string(),
    // "Your first time" rows. A value of "TBD(mike)" renders as a visible placeholder.
    first_time: z.object({
      arrive: z.string(),
      find_us: z.string(),
      crowd: z.string(),
      food: z.string(),
      bring: z.string(),
    }),
    who_for: z.array(z.string()),
  }),
});

// Only venues we actually meet at; not a directory.
const venues = defineCollection({
  loader: md("venues"),
  schema: z.object({
    name: z.string(),
    address: z.string(),
    neighborhood: z.string(),
    maps_url: z.string().url().optional(),
    notes: z.string().optional(),
  }),
});

const sponsors = defineCollection({
  loader: md("sponsors"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      kind: z.enum(["host", "event", "annual"]),
      logo: image().optional(),
      url: z.string().url().optional(),
      series: z.array(z.string()).optional(),
      event_date: z.coerce.date().optional(),
      start: z.coerce.date().optional(),
      end: z.coerce.date().optional(),
    }),
});

const jobs = defineCollection({
  loader: md("jobs"),
  schema: z
    .object({
      title: z.string(),
      company: z.string(),
      location: z.string(),
      url: z.string().url(),
      posted: z.coerce.date(),
      expires: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      source: z.enum(["slack", "direct"]).default("direct"),
    })
    .transform((job) => ({
      ...job,
      // Default expiry: 30 days after posting.
      expires: job.expires ?? new Date(job.posted.getTime() + 30 * 86_400_000),
    })),
});

const photos = defineCollection({
  loader: md("photos"),
  schema: ({ image }) =>
    z.object({
      src: image(),
      caption: z.string(),
      alt: z.string(),
      date: z.coerce.date(),
    }),
});

// Manual additions or overrides for events that aren't on any platform.
const events = defineCollection({
  loader: md("events"),
  schema: z.object({
    title: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    location: z.string().optional(),
    url: z.string().url().optional(),
    series: z.string().optional(),
  }),
});

export const collections = { series, venues, sponsors, jobs, photos, events };
