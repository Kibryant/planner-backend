import z from 'zod'

export const getWeeklyProgressSchema = z.object({
  userId: z.string(),
})
