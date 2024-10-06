import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { adminLoginSchema } from '../schemas/admin-login-schema'
import { env } from '../lib/env'
import { prisma } from '../lib/prisma'
import { sendInvalidCredentials } from '../functions/send-invalid-credentials'

export const adminLogin: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        body: adminLoginSchema,
      },
    },
    async (req, reply) => {
      const { accessCode, email, password } = req.body

      if (accessCode !== env.ADMIN_ACCESS_CODE) {
        sendInvalidCredentials(reply)
        return
      }

      if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
        sendInvalidCredentials(reply)
        return
      }

      const admin = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          purchaseDate: true,
          expirationDate: true,
          postPlan: {
            select: {
              id: true,
              day: true,
              title: true,
              description: true,
            },
          },
        },
      })

      if (!admin) {
        sendInvalidCredentials(reply)
        return
      }

      const token = app.jwt.sign({
        payload: {
          email,
        },
      })

      reply.send({ token, admin })
    }
  )
}
