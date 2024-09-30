import * as bcrypt from 'bcrypt'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { middleware } from '../middleware'
import { createUserSchema } from '../schemas/create-user-schema'
import { prisma } from '../lib/prisma'
import { env } from '../lib/env'
import { HTTP_STATUS_CODE } from '../types'

const SECRET_PASSWORD = env.SECRET_PASSWORD

export const createUser: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create-user',
    {
      preHandler: [middleware],
      schema: { body: createUserSchema },
    },
    async (request, reply) => {
      try {
        const { name, email, purchaseDate, expirationDate } = request.body

        const passwordHash = await bcrypt.hash(SECRET_PASSWORD, 10)

        const user = await prisma.user.create({
          data: {
            name,
            email,
            purchaseDate,
            expirationDate,
            password: passwordHash,
          },
        })

        reply.status(HTTP_STATUS_CODE.CREATED).send(user)
      } catch (error) {
        reply
          .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal server error' })
      }
    }
  )
}
