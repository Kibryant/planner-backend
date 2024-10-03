import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { HTTP_STATUS_CODE } from '../types'
import { adminLoginSchema } from '../schemas/admin-login-schema'
import { env } from '../lib/env'
import { prisma } from '../lib/prisma'

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

      console.log(accessCode, email, password)

      if (accessCode !== env.ADMIN_ACCESS_CODE) {
        reply
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: 'Invalid access code' })
        return
      }

      if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
        reply
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: 'Invalid credentials' })
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
        reply
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: 'Invalid credentials' })
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
