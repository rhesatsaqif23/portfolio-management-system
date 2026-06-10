import { z } from 'zod'

export const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  position: z.string().optional(),
  issuer: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  imageUrl: z.string().optional(),
  credentialUrl: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

export type AchievementInput = z.infer<typeof achievementSchema>
