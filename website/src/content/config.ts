import { defineCollection, z } from "astro:content";

const docsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
    section: z.enum(["guide", "frameworks"]).optional(),
  }),
});

export const collections = {
  docs: docsCollection,
};
