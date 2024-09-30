import z from 'zod'
import { MONTHS } from '../types'

const actionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
})

export const CreateRevenueGoalSchema = z.object({
  userId: z.string(),
  month: z.enum(MONTHS),
  monthlyGoal: z.string().optional(),
  dailyGoal: z.string().optional(),
  action: actionSchema.optional(),
})
