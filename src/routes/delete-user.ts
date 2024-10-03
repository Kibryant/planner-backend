import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '../lib/prisma'
import { middleware } from '../middleware'
import { deleteUserSchema } from '../schemas/delete-user-schema'
import { HTTP_STATUS_CODE } from '../types'

export const deleteUser: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/delete-user/:userId',
    {
      preHandler: [middleware],
      schema: { params: deleteUserSchema },
    },
    async (request, reply) => {
      const { userId } = request.params

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

      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
      })

      reply.status(HTTP_STATUS_CODE.OK).send({
        message: 'User deleted successfully',
        user,
      })
    }
  )
}
