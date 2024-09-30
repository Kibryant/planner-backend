import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { HTTP_STATUS_CODE } from '../types'
import { adminLoginSchema } from '../schemas/admin-login-schema'
import { env } from '../lib/env'

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

      const token = app.jwt.sign({
        payload: {
          email,
        },
      })

      reply.send({ token })
    }
  )
}
