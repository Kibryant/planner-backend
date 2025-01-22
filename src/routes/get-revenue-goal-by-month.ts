import { middleware } from '../middleware'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { getRevenueGoalByMonthSchema } from '../schemas/get-revenue-goal-by-month-schema'

export const getRevenueGoalByMonth: FastifyPluginAsyncZod = async app => {
  app.get(
    '/get-revenue-goals-by-month',
    {
      schema: {
        querystring: getRevenueGoalByMonthSchema,
      },
    },
    async (req, reply) => {
      const { userId, month } = req.query

      const userExists = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!userExists) {
        return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: 'User not found',
        })
      }

      const revenueGoal = await prisma.revenueGoal.findFirst({
        where: {
          userId: userExists.id,
          month,
        },
        select: {
          userId: true,
          dailyGoal: true,
          monthlyGoal: true,
          month: true,
          actions: true,
        },
      })

      reply.code(HTTP_STATUS_CODE.OK).send({
        revenueGoal: revenueGoal ?? {
          dailyGoal: '',
          monthlyGoal: '',
          month,
          actions: [],
        },
      })
    }
  )
}
