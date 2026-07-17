import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const groups = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/groups" }),
  schema: z.object({
    title: z.string(),
    group: z.string().optional(),
    imagePath: z.string(),
    summary: z.string(),
    imgAlt: z.string(),
    groupType: z.string(),
    groupId: z.string(),
    subtitle: z.string().optional(),
    organizers: z.array(z.string()).optional(),
  }),
});

const companies = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/companies" }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    url: z.string().url(),
    tags: z.array(z.string()),
    size: z.enum(["1-10", "11-50", "51-200", "200+"]),
    added: z.coerce.date(),
    sponsor: z.boolean().default(false),
    blurb: z.string().optional(),
  }),
});

const venues = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/venues" }),
  schema: z.object({
    name: z.string(),
    type: z.enum(["cowork", "cafe", "free"]),
    neighborhood: z.string(),
    address: z.string(),
    url: z.string().url(),
    pricingUrl: z.string().url().optional(),
    hours: z.string(),
    vibe: z.string(),
    meetingRooms: z.boolean(),
    notes: z.string().optional(),
    added: z.coerce.date(),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/jobs" }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    url: z.string().url(),
    applyEmail: z.string().email().optional(),
    location: z.string(),
    arrangement: z.enum(["on-site", "hybrid", "remote"]),
    term: z
      .enum(["full-time", "part-time", "contract", "internship"])
      .default("full-time"),
    category: z.string().default("engineering"),
    salary: z.string().optional(),
    posted: z.coerce.date(),
    expires: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { groups, companies, venues, jobs };
