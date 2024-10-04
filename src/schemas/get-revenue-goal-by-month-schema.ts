import z from 'zod'
import { MONTHS } from '../types'

export const getRevenueGoalByMonthSchema = z.object({
  userId: z.string(),
  month: z.enum(MONTHS),
})
