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
      const { userId, dailyGoal, month, monthlyGoal, action } = req.body

      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!userExists) {
        return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: 'User not found',
        })
      }

      const existingRevenueGoal = await prisma.revenueGoal.findFirst({
        where: { userId, month },
      })

      if (existingRevenueGoal) {
        const updatedRevenueGoal = await prisma.revenueGoal.update({
          where: { id: existingRevenueGoal.id },
          data: {
            dailyGoal: dailyGoal ?? existingRevenueGoal.dailyGoal,
            monthlyGoal: monthlyGoal ?? existingRevenueGoal.monthlyGoal,
          },
          select: {
            id: true,
            userId: true,
            dailyGoal: true,
            monthlyGoal: true,
            month: true,
            actions: {
              select: {
                id: true,
                description: true,
              },
            },
          },
        })

        if (action) {
          await prisma.action.create({
            data: {
              description: action.description,
              revenueGoalId: updatedRevenueGoal.id,
            },
          })
        }

        return reply.code(HTTP_STATUS_CODE.OK).send(updatedRevenueGoal)
      }

      const newRevenueGoal = await prisma.revenueGoal.create({
        data: {
          userId,
          dailyGoal: dailyGoal ?? null,
          monthlyGoal: monthlyGoal ?? null,
          month,
        },
        select: {
          id: true,
          userId: true,
          dailyGoal: true,
          monthlyGoal: true,
          month: true,
          actions: {
            select: {
              id: true,
              description: true,
            },
          },
        },
      })

      if (action) {
        await prisma.action.create({
          data: {
            description: action.description,
            revenueGoalId: newRevenueGoal.id,
          },
          select: {
            id: true,
            description: true,
          },
        })
      }

      return reply.code(HTTP_STATUS_CODE.CREATED).send(newRevenueGoal)
    }
  )
}
