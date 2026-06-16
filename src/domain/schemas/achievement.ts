import { z } from 'zod'

export const achievementCategoryEnum = z.enum(['Software Development', 'Hackathon', 'Photo & Video', 'Applied Technology', 'Others'])

export const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  eventName: z.string().optional(),
  organizer: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  url: z.string().optional().or(z.literal('')).refine(
    (v) => !v || /^https?:\/\/[^\s/$.?#]+\.[^\s]+$/.test(v),
    'Enter a valid URL (e.g. https://example.com)'
  ),
  category: achievementCategoryEnum,
  sortOrder: z.number().int().optional(),
})

export type AchievementInput = z.infer<typeof achievementSchema>
