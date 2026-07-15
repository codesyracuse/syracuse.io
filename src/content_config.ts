import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const groups = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/groups" }),
  schema: z.object({
    title: z.string(),
    group: z.string(),
    img: z.string(),
    summary: z.string(),
    imgAlt: z.string(),
    groupType: z.string(),
    groupId: z.string(),
  }),
});

export const collections = { groups };
