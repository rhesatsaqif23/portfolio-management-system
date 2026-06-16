import { z } from 'zod'

export const caseStudySectionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})

export const caseStudySchema = z.object({
  projectId: z.string().uuid(),
  role: z.string(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  overview: z.string().optional(),
  problems: z.array(caseStudySectionSchema).optional().default([]),
  solutions: z.array(caseStudySectionSchema).optional().default([]),
  features: z.array(caseStudySectionSchema).optional().default([]),
  contributions: z.array(caseStudySectionSchema).optional().default([]),
  results: z.array(caseStudySectionSchema).optional().default([]),
  gallery: z.array(z.object({ url: z.string(), caption: z.string() })).optional().default([]),
})

export type CaseStudyInput = z.infer<typeof caseStudySchema>
