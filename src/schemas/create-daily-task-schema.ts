import z from 'zod'
import { DAYS } from '../types'

export const createDailyTaskSchema = z.object({
  id: z.coerce.number().optional(),
  userId: z.string(),
  day: z.enum(DAYS),
  title: z.string(),
  description: z.string(),
})
