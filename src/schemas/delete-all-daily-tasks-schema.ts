import z from 'zod'
import { DAYS } from '../types'

export const deleteAllDailyTasksByDayParamsSchema = z.object({
  userId: z.string(),
})

export const deleteAllDailyTasksByDayBodySchema = z.object({
  day: z.enum(DAYS),
})
