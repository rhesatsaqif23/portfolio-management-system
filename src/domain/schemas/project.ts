import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(250).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().optional(),
})

export const caseStudySchema = z.object({
  contentMarkdown: z.string().min(1, 'Content is required'),
  galleryJsonb: z.array(z.object({ url: z.string(), caption: z.string() })).default([]),
})

export type ProjectInput = z.infer<typeof projectSchema>
export type CaseStudyInput = z.infer<typeof caseStudySchema>
