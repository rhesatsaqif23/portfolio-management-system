import { z } from 'zod'

export const statsSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100),
  value: z.string().min(1, 'Value is required').max(500),
  category: z.string().optional(),
  subValue: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
})

export type StatsInput = z.infer<typeof statsSchema>
