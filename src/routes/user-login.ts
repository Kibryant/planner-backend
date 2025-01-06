import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { userLoginSchema } from '../schemas/user-login-schema'
import { prisma } from '../lib/prisma'
import { sendInvalidCredentials } from '../functions/send-invalid-credentials'

export const userLogin: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        body: userLoginSchema,
      },
    },
    async (req, reply) => {
      const { email, password } = req.body

      const userExists = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!userExists) {
        sendInvalidCredentials(reply)
        return
      }

      if (userExists.password !== password) {
        sendInvalidCredentials(reply)
        return
      }

      const id = userExists.id
      const name = userExists.name

      const token = app.jwt.sign({
        payload: {
          id,
        },
      })

      reply.send({
        token,
        user: {
          id,
          name,
          email,
          purchaseDate: userExists.purchaseDate,
          expirationDate: userExists.expirationDate,
        },
      })
    }
  )
}
