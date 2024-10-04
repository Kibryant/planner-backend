import z from 'zod'
import { MONTHS } from '../types'

export const CreateRevenueGoalSchema = z.object({
  userId: z.string(),
  month: z.enum(MONTHS),
  monthlyGoal: z.string().optional(),
  dailyGoal: z.string().optional(),
  action: z.string().optional(),
  actionIndex: z.number().optional(),
})
