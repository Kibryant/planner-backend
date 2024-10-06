import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { middleware } from '../middleware'
import { HTTP_STATUS_CODE } from '../types'
import {
  updateUserParamsSchema,
  updateUserSchema,
} from '../schemas/update-user-schema'

export const updateUser: FastifyPluginAsyncZod = async app => {
  app.put(
    '/update-user/:userId',
    {
      preHandler: [middleware],
      schema: {
        params: updateUserParamsSchema,
        body: updateUserSchema,
      },
    },
    async (request, reply) => {
      const { userId } = request.params
      const { name, email, purchaseDate, expirationDate } = request.body

      const userExists = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!userExists) {
        reply
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .send({ message: 'User not found' })
        return
      }

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: name || userExists.name,
          email: email || userExists.email,
          purchaseDate: purchaseDate || userExists.purchaseDate,
          expirationDate,
        },
      })

      reply.status(HTTP_STATUS_CODE.OK).send({
        message: 'User updated successfully',
        user,
      })
    }
  )
}
