import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  currentRole: z.string().min(1, 'Current role is required').max(200),
  currentRoles: z.array(z.string().min(1)).optional(),
  bioShort: z.string().max(280).optional(),
  bioLong: z.string().optional(),
  avatarUrl: z.string().optional(),
  cvUrl: z.string().optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>
