import * as bcrypt from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { middlewareHotmartLatam } from '../middleware'
import { prisma } from '../lib/prisma'
import { env } from '../lib/env'
import { HTTP_STATUS_CODE } from '../types'
import { bodyWebhookHotmart } from '../schemas/body-webhook-hotmart'

const SECRET_PASSWORD = env.SECRET_PASSWORD

export const webhookHotmartLatam: FastifyPluginAsyncZod = async app => {
  app.post(
    '/webhook-hotmart-latam',
    {
      preHandler: [middlewareHotmartLatam],
      schema: { body: bodyWebhookHotmart },
    },
    async (request, reply) => {
      try {
        const { data } = request.body

        const {
          buyer,
          purchase: { approved_date },
        } = data

        const { name, email } = buyer

        const userAlreadyExists = await prisma.user.findFirst({
          where: {
            email,
          },
        })

        if (userAlreadyExists) {
          reply
            .status(HTTP_STATUS_CODE.CONFLICT)
            .send({ message: 'User already exists' })

          return
        }

        const purchaseDate = new Date()

        const expirationDate = new Date()

        expirationDate.setFullYear(expirationDate.getFullYear() + 1)

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

        reply.code(HTTP_STATUS_CODE.CREATED).send(user)
      } catch (error) {
        reply
          .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal server error' })
      }
    }
  )
}
