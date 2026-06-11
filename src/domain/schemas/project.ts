import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(250).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  descriptionShort: z.string().max(300).optional(),
  thumbnailUrl: z.string().optional(),
  techStacks: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  category: z.string().optional(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  additionalLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  sortOrder: z.number().int().optional(),
})

export type ProjectInput = z.infer<typeof projectSchema>
