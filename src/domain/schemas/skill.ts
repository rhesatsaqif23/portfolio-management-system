import { z } from 'zod'

export const skillCategoryEnum = z.enum(['mobile', 'web', 'backend', 'devops', 'design', 'other'])

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100),
  category: skillCategoryEnum,
  iconUrl: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

export type SkillInput = z.infer<typeof skillSchema>
