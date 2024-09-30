import z from 'zod'
import { DAYS } from '../types'

export const getDailyTasksByDaySchema = z.object({
  userId: z.string(),
  day: z.enum(DAYS),
})
