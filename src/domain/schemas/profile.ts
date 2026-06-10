import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  currentRoles: z.array(z.string().min(1)).min(1, 'At least one role is required'),
  bioShort: z.string().max(280).optional(),
  bioLong: z.string().optional(),
  avatarUrl: z.string().optional(),
  cvUrl: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>
