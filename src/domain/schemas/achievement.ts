import { z } from 'zod'

export const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  eventName: z.string().optional(),
  organizer: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  url: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

export type AchievementInput = z.infer<typeof achievementSchema>
