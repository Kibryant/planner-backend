import z from 'zod'

export const adminLoginSchema = z.object({
  accessCode: z.string(),
  email: z.string().email(),
  password: z.string().min(4),
})
