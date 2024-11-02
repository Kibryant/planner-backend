import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { middleware } from '../middleware'
import {
  deleteAllDailyTasksByDayParamsSchema,
  deleteAllDailyTasksByDayBodySchema,
} from '../schemas/delete-all-daily-tasks-schema'

export const deleteAllDailyTasksByDay: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/delete-all-daily-tasks/:userId',
    {
      schema: {
        params: deleteAllDailyTasksByDayParamsSchema,
        body: deleteAllDailyTasksByDayBodySchema,
      },
      preHandler: [middleware],
    },
    async (req, reply) => {
      const { userId } = req.params
      const { day } = req.body

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

      await prisma.postPlan.deleteMany({
        where: {
          userId,
          day,
        },
      })

      reply.code(HTTP_STATUS_CODE.OK).send({
        message: 'All daily tasks deleted',
      })
    }
  )
}
