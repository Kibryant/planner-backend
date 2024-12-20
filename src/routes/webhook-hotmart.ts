import * as bcrypt from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { middlewareHotmart } from '../middleware'
import { prisma } from '../lib/prisma'
import { env } from '../lib/env'
import { type DataWebhookHotmart, HTTP_STATUS_CODE } from '../types'

const SECRET_PASSWORD = env.SECRET_PASSWORD

export const webhookHotmart: FastifyPluginAsyncZod = async app => {
  app.post(
    '/webhook-hotmart',
    {
      preHandler: [middlewareHotmart],
    },
    async (request, reply) => {
      try {
        const { data } = request.body as DataWebhookHotmart

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

        const purchaseDate = new Date(approved_date)

        const expirationDate = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )

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
