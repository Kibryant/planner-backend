import z from 'zod'

export const deleteAllDailyTasksSchema = z.object({
  userId: z.string(),
})
