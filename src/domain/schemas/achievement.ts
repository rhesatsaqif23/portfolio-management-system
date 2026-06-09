import { z } from 'zod'

export const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  eventName: z.string().optional(),
  organizer: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
})

export type AchievementInput = z.infer<typeof achievementSchema>
