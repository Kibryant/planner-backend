import z from 'zod'
import { MONTHS } from '../types'

export const getRevenueGoalsByMonthSchema = z.object({
  userId: z.string(),
  month: z.enum(MONTHS),
})
