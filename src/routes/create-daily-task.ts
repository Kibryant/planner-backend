import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'
import { createDailyTaskSchema } from '../schemas/create-daily-task-schema'
import { WeekDay } from '@prisma/client'
import { middleware } from '../middleware'

export const createDailyTask: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create-daily-task',
    {
      schema: {
        body: createDailyTaskSchema,
      },
      preHandler: [middleware],
    },
    async (req, reply) => {
      const { id, userId, day, title, description } = req.body

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

      const dailyTaskExists = await prisma.postPlan.findUnique({
        where: {
          id: id || -1,
        },
      })

      if (dailyTaskExists) {
        await prisma.postPlan.update({
          where: {
            id: dailyTaskExists.id,
            userId,
          },
          data: {
            title,
            description,
          },
        })

        reply.code(HTTP_STATUS_CODE.CREATED).send({
          dailyTask: dailyTaskExists,
        })

        return
      }

      const dailyTask = await prisma.postPlan.create({
        data: {
          userId,
          day: WeekDay[day],
          title,
          description,
        },
      })

      reply.code(HTTP_STATUS_CODE.CREATED).send(dailyTask)
    }
  )
}
