import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { middleware } from '../middleware'
import { deleteAllDailyTasksSchema } from '../schemas/delete-all-daily-tasks-schema'

export const deleteAllDailyTasks: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/delete-all-daily-task',
    {
      schema: {
        params: deleteAllDailyTasksSchema,
      },
      preHandler: [middleware],
    },
    async (req, reply) => {
      const { userId } = req.params

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
        },
      })

      reply.code(HTTP_STATUS_CODE.OK).send({
        message: 'All daily tasks deleted',
      })
    }
  )
}
