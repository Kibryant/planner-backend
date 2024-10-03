import { prisma } from '../lib/prisma'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { HTTP_STATUS_CODE } from '../types'
import { middleware } from '../middleware'
import { completeDailyTaskSchema } from '../schemas/complete-daily-task-schema'

export const completeDailyTask: FastifyPluginAsyncZod = async app => {
  app.post(
    '/complete-daily-task',
    {
      schema: {
        body: completeDailyTaskSchema,
      },
      preHandler: [middleware],
    },
    async (req, reply) => {
      const { taskId, userId } = req.body

      try {
        const task = await prisma.postPlan.findUnique({
          where: {
            id: taskId,
            userId,
          },
        })

        if (!task) {
          return reply.status(HTTP_STATUS_CODE.NOT_FOUND).send({
            message: 'Tarefa não encontrada',
          })
        }

        const updatedTask = await prisma.postPlan.update({
          where: {
            id: taskId,
            userId,
          },
          data: {
            completed: !task.completed,
          },
        })

        reply.status(HTTP_STATUS_CODE.OK).send({
          message: 'Tarefa atualizada com sucesso',
          task: updatedTask,
        })
      } catch (error) {
        reply.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
          message: 'Erro ao atualizar tarefa',
        })
      }
    }
  )
}
