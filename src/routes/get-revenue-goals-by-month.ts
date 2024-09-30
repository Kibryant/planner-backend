import { middleware } from '../middleware'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { getRevenueGoalsByMonthSchema } from '../schemas/get-revenue-goals-by-month-schema'

export const getRevenueGoalsByMonth: FastifyPluginAsyncZod = async app => {
  app.get(
    '/get-revenue-goals-by-month',
    {
      schema: {
        querystring: getRevenueGoalsByMonthSchema,
      },
      preHandler: [middleware],
    },
    async (req, reply) => {
      const { userId, month } = req.query

      const userExists = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!userExists) {
        reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: 'User not found',
        })
        return
      }

      const revenueGoals = await prisma.revenueGoal.findMany({
        where: {
          userId,
          month,
        },
        orderBy: {
          month: 'asc',
        },
      })

      reply.code(HTTP_STATUS_CODE.OK).send({
        revenueGoals: revenueGoals[0],
      })
    }
  )
}
