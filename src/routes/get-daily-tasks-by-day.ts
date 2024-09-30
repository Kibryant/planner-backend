import { middleware } from '../middleware'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { getDailyTasksSchema } from '../schemas/get-daily-tasks-schema'
import { getDailyTasksByDaySchema } from '../schemas/get-daily-tasks-by-day-schema'

export const getDailyTasksByDay: FastifyPluginAsyncZod = async app => {
  app.get(
    '/get-daily-tasks-by-day',
    {
      schema: {
        querystring: getDailyTasksByDaySchema,
      },
      preHandler: [middleware],
    },
    async (req, reply) => {
      const { userId, day } = req.query

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

      const dailyTasks = await prisma.postPlan.findMany({
        where: {
          userId,
          day,
        },
        orderBy: {
          day: 'asc',
        },
      })

      reply.code(HTTP_STATUS_CODE.OK).send({ dailyTasks })
    }
  )
}
