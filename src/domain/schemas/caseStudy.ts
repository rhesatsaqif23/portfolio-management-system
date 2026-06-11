import { z } from 'zod'

export const caseStudySchema = z.object({
  projectId: z.string().uuid(),
  contentMarkdown: z.string().min(1, 'Content is required'),
  galleryJsonb: z.array(z.object({ url: z.string(), caption: z.string() })).optional().default([]),
})

export type CaseStudyInput = z.infer<typeof caseStudySchema>
