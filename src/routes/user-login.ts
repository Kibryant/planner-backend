import * as bcrypt from 'bcrypt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { userLoginSchema } from '../schemas/user-login-schema'
import { prisma } from '../lib/prisma'
import { HTTP_STATUS_CODE } from '../types'

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
        reply
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: 'Invalid credentials' })
        return
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userExists.password
      )

      if (!isPasswordValid) {
        reply
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: 'Invalid credentials' })
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
