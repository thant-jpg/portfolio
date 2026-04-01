import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    year: z.string(),
    cover: z.string(),
    images: z.array(z.string()).optional(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
})

export const collections = { projects }
