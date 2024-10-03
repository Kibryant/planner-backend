import z from 'zod'

export const updateUserParamsSchema = z.object({
  userId: z.string().cuid(),
})

export const updateUserSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  purchaseDate: z.coerce.date().optional(),
  expirationDate: z.coerce
    .date()
    .default(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
})
