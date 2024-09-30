import z from 'zod'

export const getDailyTasksSchema = z.object({
  userId: z.string(),
})
