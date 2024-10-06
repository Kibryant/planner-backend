import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { HTTP_STATUS_CODE } from '../types'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from '../lib/env'

export async function middleware(req: FastifyRequest, reply: FastifyReply) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Unauthorized' })
    return
  }

  try {
    req.jwtVerify()
  } catch (err) {
    reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Unauthorized' })
  }
}

export async function registerMiddlewares(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })

  app.register(fastifyJwt, {
    secret: env.JWT_SIGNING_KEY,
  })
}
