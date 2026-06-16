import { z } from 'zod'

export const caseStudySectionSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
})

export const caseStudySchema = z.object({
  projectId: z.string().uuid('Invalid project selection'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  overview: z.string().min(1, 'Overview is required'),
  problems: z.array(caseStudySectionSchema).optional().default([]),
  solutions: z.array(caseStudySectionSchema).optional().default([]),
  features: z.array(caseStudySectionSchema).optional().default([]),
  contributions: z.array(z.string()).optional().default([]),
  results: z.array(caseStudySectionSchema).optional().default([]),
  gallery: z.array(z.object({ url: z.string(), caption: z.string() })).optional().default([]),
})

export type CaseStudyInput = z.infer<typeof caseStudySchema>
