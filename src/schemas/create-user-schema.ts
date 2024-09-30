import z from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  purchaseDate: z.coerce.date().default(new Date()),
  expirationDate: z.coerce
    .date()
    .default(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
})
