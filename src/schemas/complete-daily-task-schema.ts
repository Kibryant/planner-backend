import z from 'zod'

export const completeDailyTaskSchema = z.object({
  userId: z.string(),
  taskId: z.coerce.number(),
})
