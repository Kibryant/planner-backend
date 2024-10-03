import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeeklyProgressSchema } from '../schemas/get-weekly-progess-schema'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { middleware } from '../middleware'

export const getWeeklyProgress: FastifyPluginAsyncZod = async app => {
  app.get(
    '/get-weekly-progress/:userId',
    {
      schema: {
        params: getWeeklyProgressSchema,
      },
      preHandler: [middleware],
    },
    async (req, reply) => {
      const { userId } = req.params

      const lastSevenDays = new Date(
        new Date().setDate(new Date().getDate() - 7)
      )

      try {
        const plans = await prisma.postPlan.findMany({
          where: {
            userId,
            createdAt: {
              gte: lastSevenDays,
            },
          },
        })

        const totalPlans = plans.length
        const completedPlans = plans.filter(plan => plan.completed).length
        const progress = (completedPlans / totalPlans) * 100

        reply.status(HTTP_STATUS_CODE.OK).send({
          totalPlans,
          completedPlans,
          progress,
        })
      } catch {
        reply
          .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal server error' })
      }
    }
  )
}
