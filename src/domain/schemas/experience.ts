import { z } from 'zod'

export const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  company: z.string().min(1, 'Company is required').max(200),
  location: z.string().min(1, 'Location is required').max(200),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.array(z.string()).optional(),
  image: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

export type ExperienceInput = z.infer<typeof experienceSchema>
