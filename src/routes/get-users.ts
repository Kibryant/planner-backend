import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { HTTP_STATUS_CODE } from '../types'
import { getUsersSchema } from '../schemas/get-users-schema'
import { middleware } from '../middleware'
import { prisma } from '../lib/prisma'

export const getUsers: FastifyPluginAsyncZod = async app => {
  app.get(
    '/get-users',
    {
      preHandler: [middleware],
      schema: { querystring: getUsersSchema },
    },
    async (request, reply) => {
      const { page, limit } = request.query

      const skip = (page - 1) * limit

      const users = await prisma.user.findMany({
        where: {
          role: 'USER',
        },
        skip,
        take: limit,
        orderBy: {
          purchaseDate: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          purchaseDate: true,
          expirationDate: true,
        },
      })

      const totalUsers = await prisma.user.count()

      const nextPage = page + 1
      const prevPage = page - 1

      reply.send({
        users,
        totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
        nextPage: nextPage <= Math.ceil(totalUsers / limit) ? nextPage : null,
        prevPage: prevPage > 0 ? prevPage : null,
      })
    }
  )
}
