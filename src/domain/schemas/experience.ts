import { z } from 'zod'

export const expTypeEnum = z.enum(['work', 'organization', 'volunteer', 'education'])

export const experienceSchema = z.object({
  orgName: z.string().min(1, 'Organization name is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  description: z.array(z.string()).optional().nullable(),
  type: expTypeEnum,
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().nullable(),
})

export type ExperienceInput = z.infer<typeof experienceSchema>
