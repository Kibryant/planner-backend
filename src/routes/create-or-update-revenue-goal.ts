import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { middleware } from '../middleware'
import { CreateRevenueGoalSchema } from '../schemas/create-revenue-goal-schema'
import { Month } from '@prisma/client'

export const createOrUpdateRevenueGoal: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create-or-update-revenue-goal',
    {
      schema: {
        body: CreateRevenueGoalSchema,
      },
      preHandler: [middleware],
    },
    async (req, reply) => {
      const { userId, dailyGoal, month, monthlyGoal, action, actionIndex } =
        req.body

      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!userExists) {
        return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: 'User not found',
        })
      }

      const existingRevenueGoal = await prisma.revenueGoal.findFirst({
        where: {
          userId,
          month,
        },
      })

      if (existingRevenueGoal) {
        let updatedActions = [...existingRevenueGoal.actions]

        if (typeof actionIndex === 'number') {
          if (action) {
            updatedActions[actionIndex] = action
          }
        } else if (action) {
          updatedActions = [...updatedActions, action].slice(0, 4)
        }

        const updatedRevenueGoal = await prisma.revenueGoal.update({
          where: { id: existingRevenueGoal.id },
          data: {
            dailyGoal: dailyGoal || existingRevenueGoal.dailyGoal,
            monthlyGoal: monthlyGoal || existingRevenueGoal.monthlyGoal,
            actions: updatedActions,
          },
          select: {
            id: true,
            dailyGoal: true,
            monthlyGoal: true,
            month: true,
            actions: true,
          },
        })

        return reply.code(HTTP_STATUS_CODE.OK).send({
          message: 'Revenue goal updated successfully',
          revenueGoal: updatedRevenueGoal,
        })
      }

      const revenueGoal = await prisma.revenueGoal.create({
        data: {
          userId,
          month: Month[month],
          dailyGoal,
          monthlyGoal,
          actions: action ? [action] : [],
        },
        select: {
          userId: true,
          dailyGoal: true,
          monthlyGoal: true,
          month: true,
        },
      })

      return reply.code(HTTP_STATUS_CODE.OK).send({
        message: 'Revenue goal created successfully',
        revenueGoal,
      })
    }
  )
}
