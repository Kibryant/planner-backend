import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { middleware } from '../middleware'
import { CreateRevenueGoalSchema } from '../schemas/create-revenue-goal-schema'

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

      const existingRevenueGoal = await prisma.revenueGoal.findUnique({
        where: {
          month,
        },
      })

      if (existingRevenueGoal) {
        let updatedActions = [...existingRevenueGoal.actions]

        // Se actionIndex for enviado, atualize a ação no índice correspondente
        if (typeof actionIndex === 'number') {
          if (action) {
            updatedActions[actionIndex] = action // Atualize a ação no índice correto
          }
        } else if (action) {
          // Adicione a nova ação ao array e mantenha o limite de 5 ações
          updatedActions = [...updatedActions, action].slice(0, 4)
        }

        const updatedRevenueGoal = await prisma.revenueGoal.update({
          where: { id: existingRevenueGoal.id },
          data: {
            dailyGoal: dailyGoal ?? existingRevenueGoal.dailyGoal,
            monthlyGoal: monthlyGoal ?? existingRevenueGoal.monthlyGoal,
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

      const newRevenueGoal = await prisma.revenueGoal.create({
        data: {
          userId,
          dailyGoal,
          monthlyGoal,
          month,
          actions: action ? [action] : [],
        },
        select: {
          id: true,
          userId: true,
          dailyGoal: true,
          monthlyGoal: true,
          month: true,
          actions: true,
        },
      })

      return reply.code(HTTP_STATUS_CODE.OK).send({
        message: 'Revenue goal created successfully',
        revenueGoal: newRevenueGoal,
      })
    }
  )
}
